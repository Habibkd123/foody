"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, CreditCard, Bell } from "lucide-react";
import { toast } from "sonner";

interface ReminderSetting {
  label: string;
  unit: string;
  value: string;
  disabled: boolean;
}

export default function AdminSettingsPage() {
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [reminders, setReminders] = useState<ReminderSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.success) {
        setGateway(data.data.paymentGateway || 'stripe');
        setReminders(data.data.reminders || []);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReminder = (index: number, field: keyof ReminderSetting, value: any) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    setReminders(newReminders);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentGateway: gateway, reminders })
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Settings saved successfully");
      } else {
        throw new Error(data?.error || "Failed to save");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const unitOptions = ["Minutes", "Hours", "Days"];
  const valueOptions = ["1", "5", "10", "15", "30", "45", "60"];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your platform configuration and notifications.</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Payment Settings */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure your active payment gateway.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Gateway</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGateway('stripe')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${gateway === 'stripe'
                      ? "border-orange-500 bg-orange-50/50 text-orange-700"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                >
                  <span className="font-bold">Stripe</span>
                </button>
                <button
                  onClick={() => setGateway('razorpay')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${gateway === 'razorpay'
                      ? "border-orange-500 bg-orange-50/50 text-orange-700"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                >
                  <span className="font-bold">Razorpay</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-2">
              <p className="font-bold">System Check:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>STRIPE: {gateway === 'stripe' ? "Active" : "Ready"}</li>
                <li>RAZORPAY: {gateway === 'razorpay' ? "Active" : "Ready"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Email Reminders */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Email Reminders
            </CardTitle>
            <CardDescription>Configure automated email notifications for orders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {reminders.map((reminder, idx) => (
              <div key={idx} className="space-y-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">{reminder.label} Before</label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!reminder.disabled}
                      onCheckedChange={(checked) => handleUpdateReminder(idx, 'disabled', !checked)}
                    />
                    <span className="text-xs text-muted-foreground">{reminder.disabled ? "Disabled" : "Enabled"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={reminder.unit}
                    onValueChange={(val) => handleUpdateReminder(idx, 'unit', val)}
                    disabled={reminder.disabled}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-10">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select
                    value={reminder.value}
                    onValueChange={(val) => handleUpdateReminder(idx, 'value', val)}
                    disabled={reminder.disabled}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-10">
                      <SelectValue placeholder="Select Value" />
                    </SelectTrigger>
                    <SelectContent>
                      {valueOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
