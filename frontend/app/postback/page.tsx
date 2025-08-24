'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function PostbackPage() {
  const [affiliateId, setAffiliateId] = useState('');
  const [copied, setCopied] = useState(false);

  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const template = `${base}/postback?affiliate_id={affiliate_id}&click_id={click_id}&amount={amount}&currency={currency}`;

  useEffect(() => {
    setAffiliateId(localStorage.getItem('affiliate_id') || '');
  }, []);

  if (!affiliateId) {
    return <p className="text-center text-gray-600 mt-8">
      Please select an affiliate on the home page.
    </p>;
  }

  const postbackUrl = template.replace('{affiliate_id}', affiliateId);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Postback URL Setup</h2>
      <p className="text-gray-600">
        Share this URL with your advertiser. They will replace placeholders with real values.
      </p>

      {/* Postback URL Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Postback URL</h3>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <code className="block bg-muted p-3 rounded-md text-sm break-all">
            {postbackUrl}
          </code>
        </CardContent>
      </Card>

      {/* URL Parameters */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">URL Parameters</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>affiliate_id</strong>: Your affiliate ID (filled: {affiliateId})</li>
            <li><strong>click_id</strong>: Unique identifier for each click</li>
            <li><strong>amount</strong>: Conversion amount</li>
            <li><strong>currency</strong>: Currency code (e.g., USD, EUR)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Example */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Example</h3>
          <code className="block bg-green-50 p-3 rounded-md text-sm break-all">
            {postbackUrl
              .replace('{click_id}', 'abc123')
              .replace('{amount}', '100')
              .replace('{currency}', 'USD')}
          </code>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">How to Use</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Copy the postback URL above</li>
            <li>Send it to your advertiser</li>
            <li>They configure their system to call this URL when conversions happen</li>
            <li>The system will track conversions automatically for your account</li>
          </ol>
        </CardContent>
      </Card>

      {/* Quick Test Button (optional) */}
      <Button
        className="mt-4"
        onClick={() => window.open(postbackUrl.replace('{click_id}', 'test123').replace('{amount}', '50').replace('{currency}', 'USD'), "_blank")}
      >
        Test Postback URL
      </Button>
    </div>
  );
}
