
"use client";
import React, { useEffect } from 'react';
import { UserCheck, Search, Filter, MoreHorizontal, Mail, ShieldCheck, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const StatusBadge = ({ status }: { status: string }) => {
  const isInactive = status.toLowerCase() === 'inactive';
  return (
    <Badge variant={isInactive ? "outline" : "default"} className={isInactive ? "bg-gray-100 text-gray-500" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3"}>
      {status || 'Active'}
    </Badge>
  );
};

const UserAvatar = ({ name, email, createdAt }: any) => {
  const initial = name ? name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U');

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-border">
        <AvatarFallback className="bg-primary/10 text-primary font-bold">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground leading-none">{name || 'Anonymous'}</span>
        <span className="text-xs text-muted-foreground mt-1">Joined {new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const UserPage = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const getUserData = async () => {
    try {
      setLoading(true);
      const result = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await result.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <User className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status !== 'Inactive').length}</div>
            <p className="text-xs text-muted-foreground mt-1">94% active rate</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft transition-all hover:shadow-soft-lg group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Signups</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <UserCheck className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">In the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-soft overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">User Directory</CardTitle>
              <CardDescription>Manage your platform users and their permissions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-full md:w-[260px] bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="w-[300px] pl-6">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><div className="h-10 w-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" /></TableCell>
                      <TableCell><div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" /></TableCell>
                      <TableCell><div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" /></TableCell>
                      <TableCell className="pr-6 text-right"><div className="h-8 w-8 ml-auto bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <UserAvatar name={user.name} email={user.email} createdAt={user.createdAt} />
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status || 'Active'} />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                              Block User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
