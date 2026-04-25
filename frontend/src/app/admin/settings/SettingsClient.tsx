"use client";

import { useState } from "react";
import { Store, CreditCard, Truck, Bell, Shield, Save, Tag, Plus, Trash2 } from "lucide-react";
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
  
  // Shipping State
  const [shippingRate, setShippingRate] = useState("9.95");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("80");
  
  // Payment State
  const [stripeEnabled, setStripeEnabled] = useState(true);

  // Notification State
  const [notifyOrderPlaced, setNotifyOrderPlaced] = useState(true);
  const [notifyOrderShipped, setNotifyOrderShipped] = useState(true);
  const [notifyOrderCancelled, setNotifyOrderCancelled] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(false);

  // Security State
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24");

  // Coupons State
  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME10", type: "percentage", value: 10, active: true },
    { id: 2, code: "FREESHIP", type: "fixed", value: 0, active: false }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState("percentage");
  const [newCouponValue, setNewCouponValue] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
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
            <Truck className="w-4 h-4" /> Shipping & Delivery
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "coupons" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <Tag className="w-4 h-4" /> Coupons & Discounts
          </button>
          <button 
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-sans text-sm ${activeTab === "payments" ? "bg-black/5 text-brand-black font-semibold" : "text-brand-muted hover:bg-black/5 hover:text-brand-black"}`}
          >
            <CreditCard className="w-4 h-4" /> Payments
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
                      <select className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black">
                        <option value="AUD">AUD ($) - Australian Dollar</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="GBP">GBP (£) - British Pound</option>
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
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Standard Shipping Rate ($)</label>
                      <input type="number" step="0.01" value={shippingRate} onChange={e => setShippingRate(e.target.value)} className="w-full max-w-md p-3 bg-[#faf9f6] border border-black/10 rounded-sm font-sans text-sm focus:outline-none focus:border-brand-black" />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold mb-2">Free Shipping Threshold ($)</label>
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
                  
                  <div className="border border-black/10 rounded-sm p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold text-xs">Stripe</div>
                      <div>
                        <h3 className="font-sans text-sm font-bold text-brand-black">Stripe Checkout</h3>
                        <p className="font-sans text-[11px] text-brand-muted mt-0.5">Accept all major credit cards and Apple Pay</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={stripeEnabled} onChange={() => setStripeEnabled(!stripeEnabled)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

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
