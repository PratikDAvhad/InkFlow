import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateProfile, changePassword } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [tab, setTab]     = useState("profile");

  const [profile, setProfile] = useState({ username: user?.username || "", bio: user?.bio || "", avatar: user?.avatar || "" });
  const [passwords, setPasswords] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [saving, setSaving]   = useState(false);

  const handleProfileSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await updateProfile(profile);
      setUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (passwords.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success("Password changed!");
      setPasswords({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Manage your account</p>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn${tab === "profile" ? " active" : ""}`} onClick={() => setTab("profile")}>👤 Profile</button>
        <button className={`tab-btn${tab === "password" ? " active" : ""}`} onClick={() => setTab("password")}>🔒 Password</button>
      </div>

      {tab === "profile" && (
        <div className="card">
          <div className="card-body">
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
              <div className="avatar avatar-lg">{user?.username?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontWeight:700 }}>{user?.username}</div>
                <div style={{ fontSize:"0.82rem", color:"var(--text-muted)", textTransform:"capitalize" }}>{user?.role}</div>
              </div>
            </div>
            <form onSubmit={handleProfileSave}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} required minLength={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-control" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} placeholder="Tell the world about yourself…" maxLength={300} />
                <div className="form-hint">{profile.bio.length}/300 characters</div>
              </div>
              <div className="form-group">
                <label className="form-label">Avatar URL</label>
                <input className="form-control" value={profile.avatar} onChange={e => setProfile({ ...profile, avatar: e.target.value })} placeholder="https://example.com/photo.jpg" />
                <div className="form-hint">Paste a link to your profile photo</div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</button>
            </form>
          </div>
        </div>
      )}

      {tab === "password" && (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handlePasswordSave}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} placeholder="Min. 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} required placeholder="Repeat new password" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Changing…" : "Change Password"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
