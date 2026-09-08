import { createFileRoute } from "@tanstack/react-router";
import { OrderApp } from "@/components/order-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <OrderApp />;
}
