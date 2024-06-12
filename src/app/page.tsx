"use client";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import WebPlayback from "../components/WebPlayback";

type Props = {
  token: string;
};

export const getServerSideProps: GetServerSideProps = (async (context) => {
  const token = context.req.cookies["spotify-token"] || "";
  return {
    props: { token },
  };
}) satisfies GetServerSideProps<Props>;


export default function Home({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
 
  return (
    <>
      <WebPlayback token={token} />
    </>
  );
}
