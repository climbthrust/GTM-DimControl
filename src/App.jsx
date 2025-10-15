import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Input,
  Text,
} from "@fluentui/react-components";
import { useState } from "react";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <FluentProvider
      theme={dark ? webDarkTheme : webLightTheme}
      style={{
        height: "100vh",
        padding: "24px",
        backgroundColor: dark
          ? webDarkTheme.colorNeutralBackground1
          : webLightTheme.colorNeutralBackground1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text size={600} weight="semibold">
          DimControl (Admin Demo)
        </Text>

        <Button
          appearance="transparent"
          onClick={() => setDark(!dark)}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
        <Input placeholder="Produkt-ID eingeben …" />
        <Button appearance="primary">Suchen</Button>
      </div>
    </FluentProvider>
  );
}
