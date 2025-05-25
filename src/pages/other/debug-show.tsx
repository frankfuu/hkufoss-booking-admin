//https://refine.dev/docs/ui-integrations/material-ui/hooks/use-auto-complete/#onsearch

import { useShow, useOne, useNavigation, useGo, useModal } from "@refinedev/core";
import { Show, NumberField, TextFieldComponent as TextField, DateField } from "@refinedev/mui";
import { Typography, Stack, Box, Button } from "@mui/material";
import InfiniteScrollAutocompleteAlt from "../../components/infinite-scroll-autocomplete";
import { k } from "../../common/constants";
import { useState } from "react";
import DynamicModal from "../../components/dynamic-modal";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

export const DebugShow = () => {
  const go = useGo();
  const handleNavigate = () => {
    go({ to: { resource: "members", action: "show", id: 13 }, query: { tab: k.TABS.MEMBERS.PROFILE } });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const uDeets = useSelector((state: { userDetails: any }) => state.userDetails);
  console.log(`uDeets`, uDeets);

  return (
    <Show>
      {/* <Button onClick={handleOpen}>Open Modal</Button>
      <DynamicModal
        open={open}
        onClose={handleClose}
        title="陳大文	Chan Tai Man"
        content={<QRCodeMemberCard cardNumber="YMCA-1001-384-R" />}
      />

      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
          Demonstrating async fetch on scroll with server side filtering
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Member search custom options and multi field filter performed locally
          </Typography>
          <MemberSearch />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by subject and display subject and action</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="permissions"
            filterOperator="contains"
            filterField="subject"
            displayField1="subject"
            displayField2="action"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by nameEn and display nameEn and nameTc</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="service-types"
            filterOperator="contains"
            filterField="nameEn"
            displayField1="nameEn"
            displayField2="nameTc"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by nameEn and display nameEn and nameTc</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="districts"
            filterOperator="contains"
            filterField="nameEn"
            displayField1="nameEn"
            displayField2="nameTc"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by nameEn and display nameEn and nameTc</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="partners"
            filterOperator="contains"
            filterField="nameEn"
            displayField1="nameEn"
            displayField2="nameTc"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by nameEn and display nameEn and nameTc</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="centres"
            filterOperator="contains"
            filterField="nameEn"
            displayField1="nameEn"
            displayField2="nameTc"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Filter by payload and display payload and model</Typography>
          <InfiniteScrollAutocompleteAlt
            resourceName="audit-log"
            filterOperator="string_contains"
            filterField="payload"
            displayField1="payload"
            displayField2="model"
          />
        </Box>
        <Box sx={{ mt: 1 }}></Box>

        <Box sx={{ mt: 1 }}></Box>
      </Box> */}
    </Show>
  );
};
