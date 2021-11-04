import * as React from "react";
import { LayoutComponent } from "../components/layout";

import AktuellesList from "../components/aktuelles_list";
import Divider from "../utils/divider";

const Berichte = () => (
  <LayoutComponent>
    <h2>Berichte</h2>
    <AktuellesList divider={Divider} />
    <Divider />
  </LayoutComponent>
);

export default Berichte;
