import React from "react";
import Container from "@/components/ui/container";
import Account from "./components/account";

const Portfolio = () => {
  return (
    <Container>
      <Account />
      <h2>Portfolio</h2>
      <p className="h-96 w-full bg-red-950"></p>
      <p className="h-96 w-full bg-orange-950"></p>
      <p className="h-96 w-full bg-yellow-950"></p>
      <p className="h-96 w-full bg-green-950"></p>
      <p className="h-96 w-full bg-blue-950"></p>
      <p className="h-96 w-full bg-purple-950"></p>
      <p className="h-96 w-full bg-red-950"></p>
    </Container>
  );
};

export default Portfolio;
