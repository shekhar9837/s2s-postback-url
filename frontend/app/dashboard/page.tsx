'use client';

import { useEffect, useState } from 'react';
import { getClicks, getConversions, logClick } from '../../lib/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"
// ✅ Strongly typed Click + Conversion
interface Click {
  id: string;
  click_id: string;
  campaign_name: string;
  campaign_id: string;
  ts: string;
}

interface Conversion {
  id: string;
  click_id: string;
  campaign_name: string;
  campaign_id: string;
  amount: number;
  currency: string;
  ts: string;
}

export default function Dashboard() {
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [convs, setConvs] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [stats, setStats] = useState({ totalClicks: 0, totalConversions: 0, totalRevenue: 0 });

  useEffect(() => {
    const id = localStorage.getItem('affiliate_id');
    setAffiliateId(id);
    if (id) fetchData(id);
    else setLoading(false);
  }, []);

  const fetchData = async (id: string) => {
    try {
      const [clickData, convData] = await Promise.all([getClicks(id), getConversions(id)]);
      console.log(clickData);
      console.log(convData);
      setClicks(clickData || []);
      setConvs(convData || []);

      const totalClicks = clickData?.length || 0;
      const totalConversions = convData?.length || 0;
      const totalRevenue = convData?.reduce((sum: number, conv: Conversion) => sum + conv.amount, 0) || 0;
      setStats({ totalClicks, totalConversions, totalRevenue });
    } catch (error) {
      toast.error("Error fetching data", { description: "Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleTestClick = async () => {
    if (!affiliateId) return;
    setTestLoading(true);
    try {
      const testClickId = `test_${Date.now()}`;
      await logClick(affiliateId, '1', testClickId);
      toast.success("Test Click Logged", { description: `ID: ${testClickId}` });
      await fetchData(affiliateId);
    } catch (error) {
      toast.error("Error", { description: "Could not log test click" });
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (!affiliateId) {
    return <p className="text-center text-gray-600">Please select an affiliate on the home page.</p>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Affiliate #{affiliateId} Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Total Clicks</p>
            <p className="text-3xl font-bold">{stats.totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Conversions</p>
            <p className="text-3xl font-bold">{stats.totalConversions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Revenue</p>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Click Button */}
      <div>
        <Button onClick={handleTestClick} disabled={testLoading}>
          {testLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {testLoading ? "Logging..." : "Log Test Click"}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          This will create a test click for demonstration purposes.
        </p>
      </div>

      {/* Clicks */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Clicks</h3>
        {clicks.length === 0 ? (
          <p className="text-gray-600">No clicks yet. Try logging a test click.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Click ID</TableCell>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clicks.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.click_id}</TableCell>
                    <TableCell>{c.campaign_name} (#{c.campaign_id})</TableCell>
                    <TableCell>{new Date(c.ts).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Conversions */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Conversions</h3>
        {convs.length === 0 ? (
          <p className="text-gray-600">No conversions yet. They will appear once advertisers trigger your postback URL.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Click ID</TableCell>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convs.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.click_id}</TableCell>
                    <TableCell>{v.campaign_name} (#{v.campaign_id})</TableCell>
                    <TableCell>${v.amount}</TableCell>
                    <TableCell>{v.currency}</TableCell>
                    <TableCell>{new Date(v.ts).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
