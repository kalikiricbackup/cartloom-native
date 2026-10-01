import { useState } from "react";

import HomePresenter from "../presenter/HomePresenter";

const HomeContainer = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Mobiles");

  return (
    <HomePresenter
      query={query}
      selectedCategory={selectedCategory}
      onQueryChange={setQuery}
      onClearQuery={() => setQuery("")}
      onCategorySelect={setSelectedCategory}
    />
  );
};

export default HomeContainer;
