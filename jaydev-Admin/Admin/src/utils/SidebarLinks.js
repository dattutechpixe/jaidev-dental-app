import { BookDashed, Settings, User, Package, Image, FileText } from "lucide-react";

export const SidebarLinks = [
  {
    icon: BookDashed,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Package,
    title: "Products",
    options: [
      { title: "Product List", path: "/product/products" },
      { title: "Add Product", path: "/product/add-product" },
    ],
  },
  {
    icon: FileText,
    title: "Blogs",
    options: [
      { title: "Blog List", path: "/blog/blogs" },
      { title: "Add Blog", path: "/blog/add-blog" },
    ],
  },
  {
    icon: Image,
    title: "Banners",
    options: [
      { title: "Banner List", path: "/banner/banners" },
      { title: "Add Banner", path: "/banner/add-banners" },
    ],
  },
  {
    icon: Settings,
    title: "Settings",
    path: "/settings",
  },
];

