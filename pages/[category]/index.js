import ImageUrlBuilder from '@sanity/image-url';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar.component';
import styles from '../../styles/Category.module.css';

const Category = ({ slug, blogs, projectId, dataset }) => {
    // console.log(slug);
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
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            <h4 className={styles.subTitle}>{slug}</h4>
            <div className={styles.all_blogs}>
                <div className={styles.deck}>
                    {
                        mappedBlogs.length
                            ? mappedBlogs.map(blog => (
                                <div
                                    key={blog._id}
                                    className={styles.card}
                                    onClick={() => router.push(`/blog/${blog.slug.current}`)}
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

export const getServerSideProps = async cntx => {
    let slug = cntx.query.category;
    const query = encodeURIComponent(`*[ _type=="post" && categories._ref in *[ _type == "category" && slug.current == "${slug}"]._id] `);
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
                blogs: result.result,
                slug
            }
        }
    }

}

export default Category
