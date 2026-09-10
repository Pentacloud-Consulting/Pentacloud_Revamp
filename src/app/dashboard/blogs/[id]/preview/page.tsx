import { BlogPreview } from '../../../../../DashBoard/sections/Blogs/Blog Preview';

export const metadata = {
  title: 'Preview Blog | Pentacloud Admin',
};

export default async function PreviewBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BlogPreview id={resolvedParams.id} />;
}
