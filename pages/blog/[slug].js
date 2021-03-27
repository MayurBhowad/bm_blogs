import BlockContent from '@sanity/block-content-to-react';
import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react';
import styles from '../../styles/blog.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';

//Components
import Navbar from '../../components/layout/Navbar.component';

const serializers = {
    types: {
        code: props => (
            <SyntaxHighlighter language={props.node.language || 'text'} >
                {props.node.code}
            </SyntaxHighlighter>
        )
    }
}


const Slug = ({ projectId, dataset, body, title, image }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const imageBuilder = imageUrlBuilder({
            projectId: projectId,
            dataset: dataset,
        });
        setImageUrl(imageBuilder.image(image))
    }, [image])


    return (
        <>
            <Navbar />
            <div>
                <h1 className={styles.title}>{title}</h1>
                <div className="title_image">
                    {imageUrl && <img src={imageUrl} className={styles.mainImage} />}
                </div>
                <div className={styles.blog_body}>
                    <BlockContent blocks={body} serializers={serializers} />
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const blogSlug = ctx.query.slug;
    const projectId = process.env.PROJECT_ID;
    const dataset = process.env.DATA_SET;

    if (!blogSlug) {
        return {
            notFound: true
        }
    }


    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${blogSlug}" ]`);
    const url = `https://${projectId}.api.sanity.io/v1/data/query/production?query=${query}`;

    const result = await fetch(url).then(res => res.json());
    const blog = result.result[0];
    // console.log(blog);

    if (!blog) {
        return {
            notFound: true
        }
    } else {
        return {
            props: {
                projectId: projectId,
                dataset: dataset,
                body: blog.body,
                title: blog.title,
                image: blog.mainImage,
            }
        }
    }
}

export default Slug
