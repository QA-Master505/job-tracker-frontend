export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto text-center text-sm text-gray-500">
      © {new Date().getFullYear()} JobTracker. All rights reserved.
    </footer>
  );
}
