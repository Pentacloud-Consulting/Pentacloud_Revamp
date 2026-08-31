import { Suspense } from 'react';
import { BlogEditor } from '../../../../../DashBoard/sections/Blogs/Blog Post/BlogEditor';

export const metadata = {
  title: 'Edit Blog | Pentacloud Admin',
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <BlogEditor id={resolvedParams.id} />
    </Suspense>
  );
}
