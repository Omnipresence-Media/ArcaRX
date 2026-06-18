import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Calendar, Users, Stethoscope, Receipt, TrendingUp,
  Boxes, MessageSquare, Settings, ChevronsUpDown, Check, CreditCard,
  Sparkles, Target, ShieldCheck, MapPin, Globe, Camera, Image as ImageIcon,
  Package, Filter, Megaphone, MailOpen, Heart, ShoppingBag, CalendarCheck,
  Share2, Phone, Award, BarChart3, Dumbbell, Salad, Video, UserCircle2,
  Wrench, Trophy, PlayCircle, Briefcase, ListChecks, ScanLine, Radio, Globe2,
  Mic, Activity, Star, BadgeDollarSign,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { practice } from "@/lib/seed-data";
import { useState } from "react";

const sections = [
  { label: "Front Desk", items: [
    { title: "Command Center", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Calendar",       url: "/admin/calendar",  icon: Calendar },
    { title: "Point of Sale",  url: "/admin/pos",       icon: CreditCard },
  ]},
  { label: "Coaching · Arca Fit", items: [
    { title: "Overview",        url: "/admin/fit",                  icon: LayoutDashboard },
    { title: "Clients",         url: "/admin/fit/clients",          icon: UserCircle2 },
    { title: "Body scans",      url: "/admin/fit/scans",            icon: ScanLine },
    { title: "Live session",    url: "/admin/fit/live",             icon: Radio },
    { title: "Program builder", url: "/admin/fit/workouts/builder", icon: Wrench },
    { title: "Workouts",        url: "/admin/fit/workouts",         icon: Dumbbell },
    { title: "Nutrition",       url: "/admin/fit/nutrition",        icon: Salad },
    { title: "Form reviews",    url: "/admin/fit/reviews",          icon: PlayCircle },
    { title: "Challenges",      url: "/admin/fit/challenges",       icon: Trophy },
    { title: "Video library",   url: "/admin/fit/videos",           icon: Video },
    { title: "Coach portal",    url: "/admin/fit/portal",           icon: Globe2 },
    { title: "Client messages", url: "/admin/fit/messages",         icon: MessageSquare },
  ]},
  { label: "Business · Arca Fit", items: [
    { title: "Revenue",         url: "/admin/fit/business",         icon: BarChart3 },
    { title: "Calendar",        url: "/admin/fit/calendar",         icon: Calendar },
    { title: "Packages & billing", url: "/admin/fit/billing",       icon: Briefcase },
    { title: "Leads pipeline",  url: "/admin/fit/leads",            icon: ListChecks },
  ]},
  { label: "Analytics", items: [
    { title: "Overview",          url: "/admin/analytics",          icon: BarChart3 },
    { title: "Acquisition Funnel",url: "/admin/acquisition",        icon: Filter },
    { title: "Paid Channels",     url: "/admin/paid-channels",      icon: Megaphone },
    { title: "Email & SMS",       url: "/admin/email-sms",          icon: MailOpen },
    { title: "Membership Health", url: "/admin/membership-health",  icon: Heart },
    { title: "Product Revenue",   url: "/admin/product-revenue",    icon: ShoppingBag },
    { title: "In-Clinic & Bookings", url: "/admin/bookings-analytics", icon: CalendarCheck },
    { title: "Referral Program",  url: "/admin/referrals",          icon: Share2 },
    { title: "Phone Calls",       url: "/admin/phone-calls",        icon: Phone },
    { title: "Coach Performance", url: "/admin/coach-performance",  icon: Award },
  ]},
  { label: "Clients", items: [
    { title: "Members",    url: "/admin/patients",    icon: Users },
    { title: "Memberships",url: "/admin/memberships", icon: Sparkles },
    { title: "Messages",   url: "/admin/messages",    icon: MessageSquare },
  ]},
  { label: "Clinical", items: [
    { title: "AI Scribe",         url: "/admin/scribe",        icon: Mic },
    { title: "Charts / EMR",      url: "/admin/charts",        icon: Stethoscope },
    { title: "Population Health", url: "/admin/population",    icon: Target },
    { title: "Telehealth & RPM",  url: "/admin/telehealth",    icon: Activity },
    { title: "Protocols",         url: "/admin/protocols",     icon: Stethoscope },
    { title: "Appointments",      url: "/admin/calendar",      icon: Calendar },
    { title: "Photo Reviews",     url: "/admin/photo-reviews", icon: Camera },
  ]},
  { label: "Catalog", items: [
    { title: "Products",        url: "/admin/products",        icon: Package },
    { title: "Results Gallery", url: "/admin/results-gallery", icon: ImageIcon },
  ]},
  { label: "Revenue", items: [
    { title: "RCM Cockpit",   url: "/admin/rcm",       icon: BadgeDollarSign },
    { title: "Billing",       url: "/admin/billing",   icon: Receipt },
  ]},
  { label: "Growth", items: [
    { title: "Reputation",       url: "/admin/reputation", icon: Star },
    { title: "Social Calendar",  url: "/admin/social",     icon: Share2 },
    { title: "Leads & Pipeline", url: "/admin/leads",    icon: Target },
    { title: "Website",          url: "/admin/website",  icon: Globe },
  ]},
  { label: "Operations", items: [
    { title: "Inventory", url: "/admin/inventory", icon: Boxes },
    { title: "Locations", url: "/admin/locations", icon: MapPin },
  ]},
  { label: "Compliance", items: [
    { title: "HIPAA Log", url: "/admin/hipaa", icon: ShieldCheck },
  ]},
  { label: "Settings", items: [
    { title: "Workspace", url: "/admin/settings", icon: Settings },
  ]},
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [locId, setLocId] = useState(practice.activeLocationId);
  const activeLoc = practice.locations.find((l) => l.id === locId) ?? practice.locations[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="relative h-9 w-9 rounded-lg gradient-brand flex items-center justify-center shadow-[0_4px_14px_-4px_color-mix(in_oklab,var(--teal)_60%,transparent)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 18 L12 5 L20 18" />
              <path d="M7.5 14 L16.5 14" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
                ARCA<sup className="ml-0.5 text-[10px] font-medium text-[color:var(--teal)]">Rx</sup>
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/55">
                Practice Intelligence
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mx-2 mb-2 flex items-center justify-between rounded-md bg-sidebar-accent/60 px-2.5 py-2 text-left text-xs text-sidebar-foreground hover:bg-sidebar-accent">
                <div className="flex flex-col">
                  <span className="font-medium">{activeLoc.name}</span>
                  <span className="text-[10px] text-sidebar-foreground/60">{activeLoc.city} · {activeLoc.members} members</span>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Switch location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {practice.locations.map((l) => (
                <DropdownMenuItem key={l.id} onClick={() => setLocId(l.id)}>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm">{l.name}</span>
                    <span className="text-[11px] text-muted-foreground">{l.city} · ${l.mrr.toLocaleString()} MRR</span>
                  </div>
                  {l.id === locId && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/45">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = pathname === item.url || pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-semibold text-sidebar-accent-foreground ring-1 ring-sidebar-border">
            JL
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-sidebar-foreground">Jordan Lee</span>
              <span className="text-[10px] text-sidebar-foreground/60">Practice Admin · Apex Group</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
