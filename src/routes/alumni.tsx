import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Building2, ExternalLink, GraduationCap, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "SocialPrachar Alumni Network" },
      { name: "description", content: "A verified directory of SocialPrachar learners and alumni." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AlumniPage,
});

type AlumniProfile = {
  id: string;
  display_name: string;
  headline: string | null;
  company_name: string | null;
  location: string | null;
  program_name: string | null;
  batch_label: string | null;
  linkedin_url: string;
  avatar_url: string | null;
};

type AlumniDirectoryClient = {
  from: (relation: "alumni_profiles") => {
    select: (columns: string) => {
      eq: (column: string, value: boolean) => {
        in: (column: string, values: string[]) => {
          order: (column: string, options: { ascending: boolean }) => Promise<{ data: AlumniProfile[] | null; error: { message: string } | null }>;
        };
      };
    };
  };
};
const alumniDirectory = supabase as unknown as AlumniDirectoryClient;

const starterProfiles: AlumniProfile[] = [
  {
    id: "mahesh-babu-channa",
    display_name: "Mahesh Babu Channa",
    headline: "Building Vajra.ai & Ziro.Digital",
    company_name: "Vajra.ai & Ziro.Digital",
    location: null,
    program_name: "SocialPrachar Team",
    batch_label: "Leadership",
    linkedin_url: "https://in.linkedin.com/in/mahibaabu",
    avatar_url: null,
  },
  {
    id: "madhav-reddy-challa",
    display_name: "Madhav Reddy Challa",
    headline: "QA Automation Engineer",
    company_name: "DXC Technology",
    location: "Hyderabad, Telangana, India",
    program_name: "SocialPrachar Team",
    batch_label: "Team",
    linkedin_url: "https://www.linkedin.com/in/madhavareddych",
    avatar_url: null,
  },
  {
    id: "suneel-kumar-kola",
    display_name: "Suneel Kumar Kola",
    headline: "Senior AI Engineer | Creator & Maintainer of EazyDataFix",
    company_name: "SocialPrachar.com",
    location: null,
    program_name: "SocialPrachar Team",
    batch_label: "Team",
    linkedin_url: "https://in.linkedin.com/in/suneelkumarkola",
    avatar_url: null,
  },
];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function AlumniPage() {
  const [profiles, setProfiles] = useState<AlumniProfile[]>(starterProfiles);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadDirectory() {
      const { data } = await alumniDirectory
        .from("alumni_profiles")
        .select("id, display_name, headline, company_name, location, program_name, batch_label, linkedin_url, avatar_url")
        .eq("is_visible", true)
        .in("publication_status", ["approved", "claimed"])
        .order("display_name", { ascending: true });
      if (active) {
        setProfiles(data && data.length > 0 ? data : starterProfiles);
        setLoading(false);
      }
    }
    void loadDirectory();
    return () => { active = false; };
  }, []);

  const visibleProfiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return profiles;
    return profiles.filter((profile) =>
      [profile.display_name, profile.headline, profile.company_name, profile.location, profile.program_name]
        .filter(Boolean).join(" ").toLowerCase().includes(term),
    );
  }, [profiles, query]);

  return (
    <div className="min-h-full bg-background">
      <section className="border-b border-border bg-accent/5">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified directory pilot
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">SocialPrachar Alumni Network</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Discover learners who began their professional journey with SocialPrachar. Profiles are individually reviewed before they appear here.</p>
          <span className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-accent" /> {profiles.length} verified profiles</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
        <label className="relative block max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, role or location" className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none ring-ring transition focus:ring-2" />
        </label>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading directory…</p>
        ) : visibleProfiles.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
            <Users className="mx-auto h-7 w-7 text-accent" />
            <h2 className="mt-4 text-base font-semibold text-foreground">The first verified profiles are being added</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">This pilot publishes only reviewed profiles. Student self-registration and profile claiming will be added in the next phase.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProfiles.map((profile) => (
              <article key={profile.id} className="rounded-xl border border-border bg-card p-5 transition hover:border-accent/50">
                <div className="flex items-start gap-3">
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-12 w-12 rounded-full border border-border object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-semibold text-accent">{initials(profile.display_name)}</div>}
                  <div className="min-w-0"><h2 className="truncate text-base font-semibold text-foreground">{profile.display_name}</h2><p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{profile.headline ?? "SocialPrachar alumnus"}</p></div>
                </div>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {profile.company_name && <p className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0 text-accent" />{profile.company_name}</p>}
                  {profile.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" />{profile.location}</p>}
                  {profile.program_name && <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 shrink-0 text-accent" />{[profile.program_name, profile.batch_label].filter(Boolean).join(" · ")}</p>}
                </div>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">View LinkedIn profile <ExternalLink className="h-3.5 w-3.5" /></a>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
