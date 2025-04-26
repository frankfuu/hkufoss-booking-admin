import { ThemedLayoutV2, Sider } from "@refinedev/mui";

const CustomSider = () => {
  return (
    <Sider
      render={({ items, logout }) => {
        return (
          <>
            <a href="https://refine.dev/">👋 Navigation Link</a>
            {items}
            {logout}
          </>
        );
      }}
    />
  );
};

const CustomThemedLayout = ({ children }: any) => {
  return <ThemedLayoutV2 Sider={CustomSider}>{children}</ThemedLayoutV2>;
};

export default CustomThemedLayout;
