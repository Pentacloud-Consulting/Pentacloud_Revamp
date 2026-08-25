"use client";

import React from 'react';
import { BlogConvertedHTML } from '../../DashBoard/sections/Blogs/Blog Fetch/Blog Convert to HTML';

export function ViewBlog({ blog }: { blog: any }) {
  return <BlogConvertedHTML blog={blog} />;
}
