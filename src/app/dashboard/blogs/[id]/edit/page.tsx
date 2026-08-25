import { BlogEditor } from '../../../../../DashBoard/sections/Blogs/Blog Post/BlogEditor';

export const metadata = {
  title: 'Edit Blog | Pentacloud Admin',
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BlogEditor id={resolvedParams.id} />;
}
