import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container mt-4">{children}</main>
    </>
  );
}
