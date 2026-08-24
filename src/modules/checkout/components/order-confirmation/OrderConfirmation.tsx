import { Link } from "react-router-dom";
import Button from "../../../../components/button/Button";
import DownloadButton from "../../../../components/download-button/DownloadButton";
import Header from "../../../../components/header/Header";
import Footer from "../../../../components/footer/Footer";
import CalendarTodayIcon from "../../../../icons/CalendarToday/CalendarToday";
import CheckIcon from "../../../../icons/Check/Check";
import DescriptionIcon from "../../../../icons/Description/Description";
import EmailOutlinedIcon from "../../../../icons/EmailOutlined/EmailOutlined";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import { COLORS } from "../../../../constants/colors";
import { viewOrderReceipt } from "../../../orders/ordersService";
import { smallActionButtonStyle } from "../../Checkout.styles";
import type { Order } from "../../../orders/types";

type OrderConfirmationProps = {
  order: Order;
};

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[800px] px-6 py-16 text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-accent-2/30 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent-2 bg-main-background">
              <CheckIcon sx={{ fontSize: 40, color: COLORS.accent2 }} />
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text-primary">
            Purchase Confirmed
          </h1>
          <p className="mt-2 text-text-secondary">
            Order #{order.id} · {orderDate}
          </p>

          <div className="mt-8 flex flex-col gap-6 text-left">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 dark:border-gray-800 border-t-4 border-t-accent-2 bg-main-background p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-2">
                    <DescriptionIcon fontSize="small" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                      <CalendarTodayIcon fontSize="inherit" />
                      <span className="font-medium">Date</span>
                      <span>{item.date}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                  <span className="font-semibold text-text-primary">
                    Amount Paid
                  </span>
                  <span className="text-lg font-bold text-text-primary">
                    USD ${item.price}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-lg p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-2 text-white">
                    <EmailOutlinedIcon fontSize="small" />
                  </div>
                  <p className="text-sm text-text-primary">
                    A receipt has been sent to your email.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <DownloadButton
                    label="View Receipt"
                    styles={smallActionButtonStyle}
                    onClick={() =>
                      viewOrderReceipt(order.id).catch((err) =>
                        console.error("Failed to load receipt:", err),
                      )
                    }
                  />
                  <Link to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}>
                    <Button
                      variant="outlined"
                      label="View Transcript"
                      startIcon={<DescriptionIcon fontSize="small" />}
                      styles={smallActionButtonStyle}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to={`${APP_ROUTES.profile}?section=purchases`}>
              <Button variant="contained" label="View My Purchase" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
