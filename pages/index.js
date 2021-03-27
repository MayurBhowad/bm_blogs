import ImageUrlBuilder from '@sanity/image-url';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar.component'
import styles from '../styles/Home.module.css'

export default function Home({ projectId, dataset, blogs }) {
  // console.log(blogs);
  const router = useRouter()
  const [mappedBlogs, setMappedBlogs] = useState([]);

  useEffect(() => {
    if (blogs.length) {
      const imageBuilder = ImageUrlBuilder({
        projectId: projectId,
        dataset: dataset,
      });
      setMappedBlogs(
        blogs.map(blog => {
          return {
            ...blog,
            mainImage: imageBuilder.image(blog.mainImage)
          }
        })
      )
    } else {
      setMappedBlogs([]);
    }
  }, [blogs])

  return (
    <div>
      <Head>
        <title>Bm_Blogs | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <h4 className={styles.subTitle}>Categories</h4>
      <div className={styles.all_blogs}>
        <div className={styles.deck}>
          {
            mappedBlogs.length
              ? mappedBlogs.map(blog => (
                <div
                  key={blog._id}
                  className={styles.card}
                  onClick={() => router.push(`/${blog.slug.current}`)}
                >
                  <img src={blog.mainImage} alt="" />
                  <h3>{blog.title}</h3>
                </div>
              ))
              : <>No Blogs!</>
          }
        </div>
      </div>

    </div>
  )
}

export const getServerSideProps = async ctx => {
  const query = `*[ _type == "category"]`;
  // const query = `*[_type == "post" && category._ref in *[_type=="category" && title=="Javascript"]._id ]{`;
  const url = `https://${process.env.PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const projectId = process.env.PROJECT_ID;
  const dataset = process.env.DATA_SET;

  const result = await fetch(url).then(res => res.json());
  // console.log(result);

  if (!result.result || !result.result.length) {
    return {
      props: {
        blogs: []
      }
    }
  } else {
    return {
      props: {
        projectId: projectId,
        dataset: dataset,
        blogs: result.result
      }
    }
  }
}