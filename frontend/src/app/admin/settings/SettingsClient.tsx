"use client";

import { useState, useEffect } from "react";
import { Store, CreditCard, Truck, Bell, Shield, Save, Tag, Plus, Trash2, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    const supabase = createClient();
    
    // Supabase auth update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
    }
    
    setIsUpdatingPassword(false);
  };

  // General State
  const [storeName, setStoreName] = useState("Fitrah");
  const [contactEmail, setContactEmail] = useState("support@fitrah.com");
  const [currency, setCurrency] = useState("AUD");
  
  // Shipping State
  const [localShippingCity, setLocalShippingCity] = useState("Lahore");
  const [localShippingRate, setLocalShippingRate] = useState("0");
  const [standardShippingRate, setStandardShippingRate] = useState("9.95");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("80");

  // Notification State
  const [notifyOrderPlaced, setNotifyOrderPlaced] = useState(true);
  const [notifyOrderShipped, setNotifyOrderShipped] = useState(true);
  const [notifyOrderCancelled, setNotifyOrderCancelled] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(false);

  // Security State
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");

  // Email / SMTP Settings State
  const [emailSettingsId, setEmailSettingsId] = useState<string | null>(null);
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromName, setFromName] = useState("Fitrah Beard Oil");
  const [adminEmail, setAdminEmail] = useState("");
  // Newsletter Settings State
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [newsletterPercent, setNewsletterPercent] = useState("10");
  const [newsletterCode, setNewsletterCode] = useState("WELCOME10");
  const [newsletterMaxUses, setNewsletterMaxUses] = useState("0");
  const [newsletterUseCount, setNewsletterUseCount] = useState(0);
  const [newsletterHeading, setNewsletterHeading] = useState("Get {discountPercent}% off\nyour first order.");
  const [newsletterDescription, setNewsletterDescription] = useState("Subscribe to the Fitrah newsletter and receive an exclusive discount code instantly, plus early access to new product launches.");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState("");

  // Payment Settings State (Database)
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIban, setBankIban] = useState("");
  const [bankInstructions, setBankInstructions] = useState("");
  const [paymentSettingsId, setPaymentSettingsId] = useState<string | null>(null);

  // Load Payment Settings
  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient();

      // Load email/newsletter settings from site_settings
      const { data: siteData } = await supabase.from("site_settings").select("*").single();
      if (siteData) {
        setEmailSettingsId(siteData.id);
        setSmtpHost(siteData.smtp_host || "smtp.gmail.com");
        setSmtpPort((siteData.smtp_port || 587).toString());
        setSmtpSecure(siteData.smtp_secure || false);
        setSmtpUser(siteData.smtp_user || "");
        setSmtpPass(siteData.smtp_pass || "");
        setFromName(siteData.from_name || "Fitrah Beard Oil");
        setAdminEmail(siteData.admin_email || "");
        setNewsletterEnabled(siteData.newsletter_enabled ?? true);
        setNewsletterPercent((siteData.newsletter_discount_percent || 10).toString());
        setNewsletterCode(siteData.newsletter_discount_code || "WELCOME10");
        setNewsletterMaxUses((siteData.newsletter_max_uses || 0).toString());
        setNewsletterUseCount(siteData.newsletter_use_count || 0);
        setNewsletterHeading(siteData.newsletter_heading || "Get {discountPercent}% off\nyour first order.");
        setNewsletterDescription(siteData.newsletter_description || "Subscribe to the Fitrah newsletter and receive an exclusive discount code instantly, plus early access to new product launches.");
      }

      // Load payment settings
      const { data, error } = await supabase.from("payment_settings").select("*").single();
      if (data) {
        setStripeEnabled(data.stripe_enabled);
        setStripePublicKey(data.stripe_public_key || "");
        setStripeSecretKey(data.stripe_secret_key || "");
        setStripeWebhookSecret(data.stripe_webhook_secret || "");
        setCodEnabled(data.cod_enabled);
        setPaymentSettingsId(data.id);
        if (data.currency) setCurrency(data.currency);
        if ((data as any).bank_transfer_enabled !== undefined) setBankTransferEnabled((data as any).bank_transfer_enabled);
        if ((data as any).bank_name) setBankName((data as any).bank_name);
        if ((data as any).bank_account_name) setBankAccountName((data as any).bank_account_name);
        if ((data as any).bank_account_number) setBankAccountNumber((data as any).bank_account_number);
        if ((data as any).bank_iban) setBankIban((data as any).bank_iban);
        if ((data as any).bank_instructions) setBankInstructions((data as any).bank_instructions);
        if ((data as any).local_shipping_city !== undefined) setLocalShippingCity((data as any).local_shipping_city);
        if ((data as any).local_shipping_rate !== undefined) setLocalShippingRate((data as any).local_shipping_rate.toString());
        if ((data as any).standard_shipping_rate !== undefined) setStandardShippingRate((data as any).standard_shipping_rate.toString());
        if ((data as any).free_shipping_threshold !== undefined) setFreeShippingThreshold((data as any).free_shipping_threshold.toString());
      }
    };
    loadSettings();
  }, []);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME10", type: "percentage", value: 10, active: true },
    { id: 2, code: "FREESHIP", type: "fixed", value: 0, active: false }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState("percentage");
  const [newCouponValue, setNewCouponValue] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save email/marketing settings
    if (activeTab === "email") {
      const supabase = createClient();
      const payload = {
        smtp_host: smtpHost,
        smtp_port: Number(smtpPort),
        smtp_secure: smtpSecure,
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
        from_name: fromName,
        admin_email: adminEmail,
        newsletter_enabled: newsletterEnabled,
        newsletter_discount_percent: Number(newsletterPercent),
        newsletter_discount_code: newsletterCode.toUpperCase(),
        newsletter_max_uses: Number(newsletterMaxUses),
        newsletter_heading: newsletterHeading,
        newsletter_description: newsletterDescription,
        updated_at: new Date().toISOString(),
      };
      if (emailSettingsId) {
        await supabase.from("site_settings").update(payload).eq("id", emailSettingsId);
      } else {
        const { data } = await supabase.from("site_settings").insert(payload).select().single();
        if (data) setEmailSettingsId(data.id);
      }
    } else if (activeTab === "payments") {
      const supabase = createClient();
      if (paymentSettingsId) {
        await supabase.from("payment_settings").update({
          stripe_enabled: stripeEnabled,
          stripe_public_key: stripePublicKey,
          stripe_secret_key: stripeSecretKey,
          stripe_webhook_secret: stripeWebhookSecret,
          cod_enabled: codEnabled,
          bank_transfer_enabled: bankTransferEnabled,
          bank_name: bankName,
          bank_account_name: bankAccountName,
          bank_account_number: bankAccountNumber,
          bank_iban: bankIban,
          bank_instructions: bankInstructions,
        }).eq("id", paymentSettingsId);
      } else {
        const { data } = await supabase.from("payment_settings").insert({
          stripe_enabled: stripeEnabled,
          stripe_public_key: stripePublicKey,
          stripe_secret_key: stripeSecretKey,
          stripe_webhook_secret: stripeWebhookSecret,
          cod_enabled: codEnabled,
          bank_transfer_enabled: bankTransferEnabled,
          bank_name: bankName,
          bank_account_name: bankAccountName,
          bank_account_number: bankAccountNumber,
          bank_iban: bankIban,
          bank_instructions: bankInstructions,
        }).select().single();
        if (data) setPaymentSettingsId(data.id);
      }
    } else if (activeTab === "general") {
      const supabase = createClient();
      if (paymentSettingsId) {
        // Safe update for currency, ignores if column doesn't exist yet but user should run sql
        await supabase.from("payment_settings").update({
          currency: currency
        }).eq("id", paymentSettingsId);
      } else {
        const { data } = await supabase.from("payment_settings").insert({
          currency: currency
        }).select().single();
        if (data) setPaymentSettingsId(data.id);
      }
    } else if (activeTab === "shipping") {
      const supabase = createClient();
      if (paymentSettingsId) {
        const { error } = await supabase.from("payment_settings").update({
          local_shipping_city: localShippingCity,
          local_shipping_rate: Number(localShippingRate),
          standard_shipping_rate: Number(standardShippingRate),
          free_shipping_threshold: Number(freeShippingThreshold)
        }).eq("id", paymentSettingsId);
        if (error) {
          alert("Error saving: " + error.message);
          setIsSaving(false);
          return;
        }
      } else {
        const { data } = await supabase.from("payment_settings").insert({
          local_shipping_city: localShippingCity,
          local_shipping_rate: Number(localShippingRate),
          standard_shipping_rate: Number(standardShippingRate),
          free_shipping_threshold: Number(freeShippingThreshold)
        }).select().single();
        if (data) setPaymentSettingsId(data.id);
      }
    }
    
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addCoupon = () => {
    if (!newCouponCode || !newCouponValue) return;
    const newCoupon = {
      id: Date.now(),
      code: newCouponCode.toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      active: true
    };
    setCoupons([...coupons, newCoupon]);
    setNewCouponCode("");
    setNewCouponValue("");
  };

  const removeCoupon = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const toggleCouponStatus = (id: number) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="space-y-8 relative">
      {/* Success Toast */}
      {showToast && (
        <div className="absolute top-0 right-0 bg-brand-black text-white px-6 py-3 rounded-sm font-sans text-xs uppercase tracking-widest font-bold shadow-xl animate-fade-in flex items-center gap-3 z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          Settings Saved Successfully
        </div>
      )}

      <div>
        <h1 className="font-serif text-3xl text-brand-black mb-1">Settings</h1>
        <p className="font-sans text-sm text-brand-muted">Manage your store preferences and integrations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "general" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Store className="w-4 h-4" /> General
          </button>
          <button 
            onClick={() => setActiveTab("shipping")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "shipping" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Truck className="w-4 h-4" /> Shipping &amp; Delivery
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "coupons" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Tag className="w-4 h-4" /> Coupons &amp; Discounts
          </button>
          <button 
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "payments" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <CreditCard className="w-4 h-4" /> Payments
          </button>
          <button 
            onClick={() => setActiveTab("email")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "email" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Mail className="w-4 h-4" /> Emails &amp; Marketing
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "notifications" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "security" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-white border border-black/10 rounded-sm">
            
            <div className="p-8">
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-serif text-xl text-brand-black mb-4">Store Details</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Store Name</label>
                        <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Support Email</label>
                        <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        <p className="mt-2 font-sans text-[11px] text-brand-muted">This email will be used to send order confirmations and customer support replies.</p>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-black/10 my-8" />
                  
                  <div>
                    <h2 className="font-serif text-xl text-brand-black mb-4">Store Currency</h2>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Currency</label>
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black">
                        <option value="AUD">AUD ($) - Australian Dollar</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === "shipping" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-xl text-brand-black mb-4">Shipping Rates</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Local Shipping City</label>
                      <input type="text" value={localShippingCity} onChange={e => setLocalShippingCity(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                      <p className="mt-2 font-sans text-[11px] text-brand-muted">The city that receives the local shipping rate.</p>
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Local Shipping Rate ({localShippingCity})</label>
                      <input type="number" step="0.01" value={localShippingRate} onChange={e => setLocalShippingRate(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                      <p className="mt-2 font-sans text-[11px] text-brand-muted">Applied when city is entered as "{localShippingCity}".</p>
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Standard Shipping Rate (Other Cities)</label>
                      <input type="number" step="0.01" value={standardShippingRate} onChange={e => setStandardShippingRate(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Free Shipping Threshold</label>
                      <input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                      <p className="mt-2 font-sans text-[11px] text-brand-muted">Orders above this amount will automatically receive free shipping.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === "coupons" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-serif text-xl text-brand-black mb-4">Manage Coupons</h2>
                    
                    {/* Add new coupon */}
                    <div className="bg-[#faf9f6] p-5 border border-black/10 rounded-sm mb-6 space-y-4">
                      <h3 className="font-sans text-xs uppercase tracking-widest text-brand-black font-semibold">Create New Coupon</h3>
                      <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Code</label>
                          <input type="text" placeholder="SUMMER20" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm uppercase focus:outline-none focus:border-brand-black" />
                        </div>
                        <div className="w-full sm:w-32">
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Type</label>
                          <select value={newCouponType} onChange={e => setNewCouponType(e.target.value)} className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black">
                            <option value="percentage">% Off</option>
                            <option value="fixed">$ Off</option>
                          </select>
                        </div>
                        <div className="w-full sm:w-32">
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Value</label>
                          <input type="number" placeholder="10" value={newCouponValue} onChange={e => setNewCouponValue(e.target.value)} className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        </div>
                        <button type="button" onClick={addCoupon} className="bg-brand-black text-white h-[46px] px-6 rounded-sm font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>
                    </div>

                    {/* Coupons List */}
                    <div className="border border-black/10 rounded-sm overflow-hidden">
                      <table className="w-full text-left font-sans text-sm">
                        <thead className="bg-black/5 text-brand-muted text-[10px] uppercase tracking-widest">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Code</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">Value</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                          {coupons.map(coupon => (
                            <tr key={coupon.id}>
                              <td className="px-4 py-3 font-bold text-brand-black">{coupon.code}</td>
                              <td className="px-4 py-3 capitalize text-brand-muted">{coupon.type}</td>
                              <td className="px-4 py-3 font-medium text-brand-black">
                                {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                              </td>
                              <td className="px-4 py-3">
                                <button type="button" onClick={() => toggleCouponStatus(coupon.id)} className={`px-2 py-1 rounded-sm text-[9px] uppercase tracking-widest font-bold ${coupon.active ? "bg-green-100 text-green-700" : "bg-black/5 text-brand-muted"}`}>
                                  {coupon.active ? "Active" : "Inactive"}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button type="button" onClick={() => removeCoupon(coupon.id)} className="text-brand-muted hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {coupons.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-brand-muted italic">No coupons found. Create one above.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-xl text-brand-black mb-4">Payment Providers</h2>
                  
                  {/* Stripe Section */}
                  <div className={`border rounded-sm transition-colors ${stripeEnabled ? 'border-brand-black/20 bg-black/[0.02]' : 'border-black/10'}`}>
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold text-xs">Stripe</div>
                        <div>
                          <h3 className="font-sans text-sm font-bold text-brand-black">Stripe Checkout</h3>
                          <p className="font-sans text-[11px] text-brand-muted mt-0.5">Accept all major credit cards and Apple Pay</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={stripeEnabled} onChange={() => setStripeEnabled(!stripeEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#635BFF]"></div>
                      </label>
                    </div>
                    
                    {stripeEnabled && (
                      <div className="px-5 pb-5 pt-2 border-t border-black/5 space-y-4">
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Publishable Key</label>
                          <input type="text" value={stripePublicKey} onChange={e => setStripePublicKey(e.target.value)} placeholder="pk_test_..." className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-[#635BFF]" />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Secret Key</label>
                          <input type="password" value={stripeSecretKey} onChange={e => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-[#635BFF]" />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Webhook Secret</label>
                          <input type="password" value={stripeWebhookSecret} onChange={e => setStripeWebhookSecret(e.target.value)} placeholder="whsec_..." className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-[#635BFF]" />
                          <p className="mt-1 font-sans text-[10px] text-brand-muted">Used to securely verify payment success from Stripe.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery Section */}
                  <div className="border border-black/10 rounded-sm p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-brand-black rounded flex items-center justify-center text-white font-bold text-xs">COD</div>
                      <div>
                        <h3 className="font-sans text-sm font-bold text-brand-black">Cash on Delivery</h3>
                        <p className="font-sans text-[11px] text-brand-muted mt-0.5">Allow customers to pay when they receive their order</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={codEnabled} onChange={() => setCodEnabled(!codEnabled)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-black"></div>
                    </label>
                  </div>

                  {/* Bank Transfer Section */}
                  <div className={`border rounded-sm transition-colors ${bankTransferEnabled ? 'border-brand-black/20 bg-black/[0.02]' : 'border-black/10'}`}>
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-emerald-700 rounded flex items-center justify-center text-white font-bold text-[10px]">BANK</div>
                        <div>
                          <h3 className="font-sans text-sm font-bold text-brand-black">Bank Transfer</h3>
                          <p className="font-sans text-[11px] text-brand-muted mt-0.5">Customer transfers amount directly to your bank account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={bankTransferEnabled} onChange={() => setBankTransferEnabled(!bankTransferEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                      </label>
                    </div>
                    {bankTransferEnabled && (
                      <div className="px-5 pb-5 pt-2 border-t border-black/5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Bank Name</label>
                            <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. HBL, Meezan, UBL" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Account Name</label>
                            <input type="text" value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} placeholder="e.g. Fitrah Beard Oil" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Account Number</label>
                            <input type="text" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} placeholder="e.g. 1234-5678-9012" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">IBAN (Optional)</label>
                            <input type="text" value={bankIban} onChange={e => setBankIban(e.target.value)} placeholder="e.g. PK36SCBL0000001123456702" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Additional Instructions (Optional)</label>
                          <textarea value={bankInstructions} onChange={e => setBankInstructions(e.target.value)} rows={2} placeholder="e.g. After transfer, send screenshot to our WhatsApp..." className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black resize-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal (Coming Soon) */}
                  <div className="border border-black/10 rounded-sm p-5 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-[#00457C] rounded flex items-center justify-center text-white font-bold text-xs italic">PayPal</div>
                      <div>
                        <h3 className="font-sans text-sm font-bold text-brand-black">PayPal</h3>
                        <p className="font-sans text-[11px] text-brand-muted mt-0.5">Integration coming soon</p>
                      </div>
                    </div>
                    <button type="button" disabled className="text-[10px] font-sans uppercase tracking-widest text-brand-muted font-bold border border-black/10 px-3 py-1 rounded">Coming Soon</button>
                  </div>
                </div>
              )}

              {/* Email & Marketing Tab */}
              {activeTab === "email" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="font-serif text-xl text-brand-black mb-1">Email Server (SMTP)</h2>
                    <p className="font-sans text-xs text-brand-muted mb-6">Configure the Gmail or SMTP account that will send all emails from this website.</p>

                    {/* SMTP Provider Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => { setSmtpHost("smtp.gmail.com"); setSmtpPort("587"); setSmtpSecure(false); }}
                        className={`p-4 border rounded-sm text-left transition-colors ${
                          smtpHost === "smtp.gmail.com" ? "border-brand-black bg-black/[0.02]" : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-[#EA4335] rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>
                          <span className="font-sans text-sm font-bold text-brand-black">Gmail</span>
                          {smtpHost === "smtp.gmail.com" && <span className="ml-auto font-sans text-[9px] uppercase tracking-widest bg-brand-black text-white px-2 py-0.5 rounded-sm">Selected</span>}
                        </div>
                        <p className="font-sans text-[11px] text-brand-muted">Use your Gmail account with an App Password</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSmtpHost(""); setSmtpPort("587"); setSmtpSecure(false); }}
                        className={`p-4 border rounded-sm text-left transition-colors ${
                          smtpHost !== "smtp.gmail.com" ? "border-brand-black bg-black/[0.02]" : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center text-white text-xs">@</div>
                          <span className="font-sans text-sm font-bold text-brand-black">Custom SMTP</span>
                          {smtpHost !== "smtp.gmail.com" && <span className="ml-auto font-sans text-[9px] uppercase tracking-widest bg-brand-black text-white px-2 py-0.5 rounded-sm">Selected</span>}
                        </div>
                        <p className="font-sans text-[11px] text-brand-muted">Use any SMTP provider (Outlook, Yahoo, etc.)</p>
                      </button>
                    </div>

                    {/* Gmail Instructions */}
                    {smtpHost === "smtp.gmail.com" && (
                      <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                        <p className="font-sans text-[11px] font-bold text-blue-800 uppercase tracking-widest mb-2">How to get Gmail App Password</p>
                        <ol className="font-sans text-[12px] text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="underline">myaccount.google.com/security</a></li>
                          <li>Enable 2-Step Verification</li>
                          <li>Search for "App Passwords" → Create one for "Mail"</li>
                          <li>Copy the 16-character password and paste it below</li>
                        </ol>
                      </div>
                    )}

                    <div className="space-y-4">
                      {smtpHost !== "smtp.gmail.com" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">SMTP Host</label>
                            <input type="text" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} placeholder="smtp.yourhost.com" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Port</label>
                            <input type="number" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} placeholder="587" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">{smtpHost === "smtp.gmail.com" ? "Gmail Address" : "Email (Username)"}</label>
                          <input type="email" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} placeholder="you@gmail.com" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">{smtpHost === "smtp.gmail.com" ? "Gmail App Password" : "SMTP Password"}</label>
                          <input type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} placeholder={smtpHost === "smtp.gmail.com" ? "xxxx xxxx xxxx xxxx" : "Your SMTP password"} className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Sender Name (From)</label>
                          <input type="text" value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Fitrah Beard Oil" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Admin Email (receives alerts)</label>
                          <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="your@email.com" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                          <p className="mt-1 font-sans text-[11px] text-brand-muted">New order alerts and contact form messages will be delivered here.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-black/10" />

                  {/* Newsletter / CTA Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-serif text-xl text-brand-black">Newsletter &amp; Homepage CTA</h2>
                        <p className="font-sans text-xs text-brand-muted mt-1">Control the discount offer section on the homepage.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={newsletterEnabled} onChange={() => setNewsletterEnabled(!newsletterEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-black"></div>
                        <span className="ml-3 font-sans text-xs font-semibold text-brand-black">{newsletterEnabled ? "Visible on Homepage" : "Hidden from Homepage"}</span>
                      </label>
                    </div>

                    {newsletterEnabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Discount Percentage (%)</label>
                            <input type="number" min="1" max="99" value={newsletterPercent} onChange={e => setNewsletterPercent(e.target.value)} className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                            <p className="mt-1 font-sans text-[11px] text-brand-muted">Used as {"{discountPercent}"} in the heading.</p>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Discount Code</label>
                            <input type="text" value={newsletterCode} onChange={e => setNewsletterCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm uppercase focus:outline-none focus:border-brand-black" />
                            <p className="mt-1 font-sans text-[11px] text-brand-muted">This code is sent to subscribers via email.</p>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Max Uses (0 = Unlimited)</label>
                            <input type="number" min="0" value={newsletterMaxUses} onChange={e => setNewsletterMaxUses(e.target.value)} className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                            <p className="mt-1 font-sans text-[11px] text-brand-muted">Used so far: <strong>{newsletterUseCount}</strong></p>
                          </div>
                        </div>
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Newsletter Heading</label>
                            <textarea value={newsletterHeading} onChange={e => setNewsletterHeading(e.target.value)} rows={2} className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black resize-none" />
                            <p className="mt-1 font-sans text-[11px] text-brand-muted">Use {"{discountPercent}"} to insert the discount percentage. Line breaks are supported.</p>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Newsletter Description</label>
                            <textarea value={newsletterDescription} onChange={e => setNewsletterDescription(e.target.value)} rows={2} className="w-full p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black resize-none" />
                          </div>
                        </div>
                        <div className="p-4 bg-[#faf9f6] border border-black/10 rounded-sm flex items-start gap-3 mt-4">
                          <div className="w-8 h-8 bg-brand-black rounded-sm flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-sans text-xs font-bold text-brand-black">How it works</p>
                            <p className="font-sans text-[11px] text-brand-muted mt-0.5">When a user enters their email on the homepage and clicks "Claim Discount", they instantly receive an email containing the <strong>{newsletterCode}</strong> code. The same code works on the checkout page.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-xl text-brand-black mb-4">Email Notifications</h2>
                  <p className="font-sans text-sm text-brand-muted mb-6">Choose which emails you receive as an administrator.</p>
                  
                  <div className="space-y-4">
                    {[
                      { label: "New Order Placed", desc: "Get notified when a customer completes checkout", state: notifyOrderPlaced, setter: setNotifyOrderPlaced },
                      { label: "Order Shipped/Delivered", desc: "Get copies of shipping updates sent to customers", state: notifyOrderShipped, setter: setNotifyOrderShipped },
                      { label: "Order Cancellations", desc: "Alert me when an order is cancelled", state: notifyOrderCancelled, setter: setNotifyOrderCancelled },
                      { label: "Low Stock Warning", desc: "Daily digest of products running out of stock", state: notifyLowStock, setter: setNotifyLowStock },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-[#faf9f6] border border-black/10 rounded-sm">
                        <div>
                          <p className="font-sans text-sm font-bold text-brand-black">{item.label}</p>
                          <p className="font-sans text-[11px] text-brand-muted mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={item.state} onChange={() => item.setter(!item.state)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-serif text-xl text-brand-black mb-4">Security Settings</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-5 border border-black/10 rounded-sm">
                      <div>
                        <h3 className="font-sans text-sm font-bold text-brand-black">Two-Factor Authentication (2FA)</h3>
                        <p className="font-sans text-[11px] text-brand-muted mt-1">Require a secondary code when logging into the admin panel.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Admin Session Timeout</label>
                      <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black">
                        <option value="1">1 Hour</option>
                        <option value="8">8 Hours (Working Day)</option>
                        <option value="24">24 Hours</option>
                        <option value="168">7 Days</option>
                      </select>
                      <p className="mt-2 font-sans text-[11px] text-brand-muted">Automatically log out inactive administrators after this duration.</p>
                    </div>

                    <div className="pt-6 border-t border-black/10">
                      <h3 className="font-sans text-sm font-bold text-brand-black mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-3 bg-white border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                        {passwordMessage.text && (
                          <p className={`font-sans text-xs ${passwordMessage.type === "error" ? "text-red-600" : "text-green-600"}`}>{passwordMessage.text}</p>
                        )}
                        <button type="button" onClick={handleUpdatePassword} disabled={isUpdatingPassword || !newPassword} className="bg-brand-black text-white px-6 py-3 rounded-sm font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50">
                          {isUpdatingPassword ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Save Action Footer */}
            <div className="bg-[#faf9f6] p-6 border-t border-black/10 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-black text-white px-8 py-3 rounded-sm font-sans text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
