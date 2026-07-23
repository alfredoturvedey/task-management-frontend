import BannerHome from "@/components/features/Home/Banners";
import SectionProducts from "@/components/features/Home/Section-Products";
import HowItWorks from "@/components/features/Home/Steps";
import MainLayout from "@/components/layout/MainLayout";

const HomePage = () => {
  return (
    <MainLayout>
      <>
        <div className="w-full">
          <BannerHome />
          <HowItWorks/>
          <SectionProducts/>
        </div>
      </>
    </MainLayout>
  );
};

export default HomePage;
