import Career from "@/Web-Page/Career/Career";
import Navbar from "@/Component/Navbar";
import Footer from "@/Component/Footer";

export const metadata = {
  title: "Careers | Pentacloud Consulting",
  description: "Join the Pentacloud Consulting team. Explore career opportunities and submit your resume.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <Career />
      <Footer />
    </>
  );
}
