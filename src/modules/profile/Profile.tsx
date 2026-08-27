import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useOrders } from "../orders/hooks/useOrders";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { fetchProfile, type Profile as ProfileData } from "./profileService";
import { fetchMyTopicRequests } from "../transcripts/components/request-topic-dialog/myRequestsService";
import type { TopicRequestItem } from "../transcripts/components/request-topic-dialog/myRequestsService";
import UserDetails from "./components/user-details/UserDetails";
import PurchaseHistory from "./components/purchase-history/PurchaseHistory";
import InvoiceList from "./components/invoice-list/InvoiceList";
import RequestedTopics from "./components/requested-topics/RequestedTopics";
import ProfileSidebar from "./components/sidebar/ProfileSidebar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import type { ProfileTab } from "./types";

const PROFILE_SECTION_PARAMS: ProfileTab[] = [
  "purchases",
  "invoice",
  "requestedTopics",
];

export default function Profile() {
  const { orders, loadOrders } = useOrders();
  const { userName, email, companyName } = useCurrentUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [topicRequests, setTopicRequests] = useState<TopicRequestItem[]>([]);
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    PROFILE_SECTION_PARAMS.includes(sectionParam as ProfileTab)
      ? (sectionParam as ProfileTab)
      : "profile",
  );

  useEffect(() => {
    loadOrders().catch((err) => console.error("Failed to load orders:", err));
    fetchProfile()
      .then(setProfile)
      .catch((err) => console.error("Failed to load profile:", err));
    fetchMyTopicRequests(1, 50, "")
      .then((page) => setTopicRequests(page.items))
      .catch((err) => console.error("Failed to load topic requests:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1800px] px-6 py-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="min-w-0 flex-1">
              {activeTab === "profile" && (
                <UserDetails
                  userName={profile?.name ?? userName}
                  email={profile?.email ?? email}
                  companyName={profile?.companyName ?? companyName}
                />
              )}
              {activeTab === "purchases" && <PurchaseHistory orders={orders} />}
              {activeTab === "invoice" && <InvoiceList orders={orders} />}
              {activeTab === "requestedTopics" && (
                <RequestedTopics items={topicRequests} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
