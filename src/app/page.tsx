"use client";
import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useState, useEffect } from 'react';

import WebPlayback from "../components/WebPlayback";

type Props = {
  token: string;
};

export const getServerSideProps: GetServerSideProps = (async (context) => {
  if (context.req.cookies["spotify-token"]) {
    const token: string = context.req.cookies["spotify-token"];
    return {
      props: { token },
    };
  } else {
    return {
      props: { token: "" },
    };
  }
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
