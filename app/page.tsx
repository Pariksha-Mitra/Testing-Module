import Link from "next/link";

const Home = () => {
  return (
    <div className="flex justify-center items-center w-full h-dvh">
      <Link href={"/dashboard"}>Dashboard</Link>
    </div>
  );
};

export default Home;
