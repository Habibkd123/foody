import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentOptions = [
    "Wallets",
    "Add credit or debit cards",
    "Netbanking",
    "Add new UPI ID",
    "Cash",
    "Pay Later",
  ];

  const cartItems = [
    { name: "3 x 75 g", price: 54 },
    { name: "Thins Pre-Rolled Rolling Pa...", price: 25 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-5xl mx-auto">
      {/* Payment Methods */}
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {paymentOptions.map((option, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {option}
                </AccordionTrigger>
                <AccordionContent>
                  {option === "Cash" ? (
                    <p className="text-sm text-muted-foreground">
                      Cash on delivery is not applicable on first order with item total less than ₹100
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Enter your {option.toLowerCase()} details.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-md mb-2">Delivery Address</h3>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Work:</strong> Floor 919, 123 Main St, City, Country, Zip Code1222, sanjay, Suraj Nagar, Jhotwara, Jaipur
          </p>

          <h3 className="font-semibold text-md mb-2">My Cart <span className="text-sm text-gray-500">({cartItems.length} items)</span></h3>
          <ul className="text-sm mb-4">
            {cartItems.map((item, i) => (
              <li key={i} className="flex justify-between py-1">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </li>
            ))}
          </ul>

          <Button disabled={total < 100} className="w-full bg-gray-700 text-white mt-2">
            Pay Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
