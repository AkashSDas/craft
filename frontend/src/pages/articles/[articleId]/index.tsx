import { AuthorInfo } from "@app/components/display-article/AuthorInfo";
import { ControlPanel } from "@app/components/display-article/ControlPanel";
import { DisplayBlock } from "@app/components/display-article/DisplayBlock";
import { Article, getArticle } from "@app/services/articles";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useMemo } from "react";

export const getServerSideProps: GetServerSideProps<{
    article: Article;
    likeCount: number;
}> = async function (ctx) {
    const articleId = ctx.params?.articleId as string;
    const res = await getArticle(articleId);
    console.log(res);
    if (!res.article || !res?.article?.isPublic) {
        return { notFound: true };
    }

    return {
        props: {
            article: res.article,
            likeCount: res.likeCount,
        },
    };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ArticlePage(props: Props) {
    const { article, likeCount } = props;
    const blockIds = useMemo(
        function removeInfoBlocks() {
            const headline = Object.values(article.blocks).find((blk) => {
                return blk.type === "heading" && blk.value.variant === "h1";
            });

            const description = Object.values(article.blocks).find((blk) => {
                return blk.type === "paragraph";
            });

            return article.blockIds.filter((id) => {
                if (id !== headline?.blockId && id !== description?.blockId) {
                    return true;
                }
                return false;
            });
        },
        [article.blockIds]
    );

    return (
        <>
            <Head>
                <title>{article.headline}</title>
                <meta name="description" content={article.description} />
                <meta property="og:title" content={article.headline} />
                <meta property="og:description" content={article.description} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={article.coverImage?.URL!} />
            </Head>

            <VStack
                as="main"
                my={{ base: "2rem", sm: "4rem" }}
                mt={{ base: "calc(1rem + 70px)", sm: "calc(4rem + 70px)" }}
                w="100%"
                alignItems="center"
                px="2rem"
            >
                <VStack gap="0px" w="100%" maxW="700px" alignItems="start">
                    <Heading
                        as="h1"
                        fontSize={{ base: "28px", sm: "39.81px" }}
                        fontWeight="bold"
                    >
                        {article.headline}
                    </Heading>
                    <Text
                        fontSize={{ base: "18px", sm: "20px" }}
                        color="gray.500"
                        fontFamily="serif"
                        mt={{ base: "8px", sm: "12px" }}
                    >
                        {article.description}
                    </Text>

                    <AuthorInfo
                        author={article.authorIds[0]}
                        lastUpdatedAt={article.lastUpdatedAt}
                    />

                    <ControlPanel likeCount={likeCount} article={article} />

                    <VStack w="100%" alignItems="start" mt="2rem">
                        {blockIds.map((id) => {
                            const blk = article.blocks[id];
                            if (!blk) return null;
                            return <DisplayBlock key={id} block={blk} />;
                        })}
                    </VStack>
                </VStack>
            </VStack>
        </>
    );
}
