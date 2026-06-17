import Banner from "@/components/Banner";
import Contact from "@/components/Contact";
import Featured from "@/components/Featured";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Banner />
      <Featured />
      <Contact />
    </div>
  );
}
