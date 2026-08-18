import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getPaperSx,
  getInputBaseSx,
  getOrangeCircleButtonSx,
  getOrangeSendIconSx,
} from "./SearchBar.styles";

const SEARCH_ICON_SRC = "/assets/search.png";

type Props = {
  placeholder: string;
  onSearch: (text: string) => void;
  searchValue: string;
  minWidth?: string;
  showToolTip?: boolean;
  maxWidth?: string;
  m?: {
    xs: string;
    sm: string;
  };
  p?: string;
  showSearchIcon?: boolean;
  type?: string;
  getOnChange?: boolean;
  onChangeFunction?: (text: string) => void | undefined;
  isLoading?: boolean;
  height?: string;
  submitButtonVariant?: "default" | "orange-circle";
  borderRadius?: string;
  backgroundColor?: string;
  boxShadow?: string;
  inputFontSize?: string;
  clearTriggersSearch?: boolean;
};

export type SearchBarHandle = {
  resetSearch: () => void;
};

const SearchBar = React.forwardRef<SearchBarHandle, Props>(
  (
    {
      placeholder,
      onSearch,
      searchValue,
      minWidth,
      maxWidth,
      m,
      p,
      showSearchIcon = true,
      showToolTip = false,
      type,
      getOnChange = false,
      onChangeFunction = undefined,
      isLoading = false,
      height = "32px",
      submitButtonVariant = "default",
      borderRadius = "25px",
      backgroundColor = "rgba(111, 105, 105, 0.07)",
      boxShadow = "none",
      inputFontSize = "12px",
      clearTriggersSearch = true,
    },
    ref,
  ) => {
    const [search, setSearch] = useState(searchValue);

    function onSubmit(event: FormEvent) {
      event.preventDefault();
      event.stopPropagation();
      onSearch(search);
    }
    React.useImperativeHandle(ref, () => ({
      resetSearch() {
        setSearch("");
        onSearch("");
      },
    }));
    useEffect(() => {
      setSearch(searchValue);
    }, [searchValue]);
    const getToolTip = () => {
      if (showToolTip && search.length > 2) {
        return search;
      }
      return null;
    };
    const handleInputBaseChange = (event: any) => {
      // No input field should accept a leading space.
      const value = event.target.value.replace(/^\s+/, "");
      setSearch(value);
      if (getOnChange && onChangeFunction) {
        onChangeFunction(value);
      }
      if (value === "" && clearTriggersSearch) {
        onSearch("");
      }
    };
    return (
      <Tooltip
        title={getToolTip()}
        leaveTouchDelay={7000}
        enterTouchDelay={0}
        arrow
        placement="top"
        followCursor
      >
        <Paper
          component="form"
          sx={getPaperSx({
            m,
            p,
            submitButtonVariant,
            height,
            borderRadius,
            backgroundColor,
            boxShadow,
            maxWidth,
            minWidth,
          })}
          onSubmit={onSubmit}
        >
          {showSearchIcon && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                alt="search icon"
                src={SEARCH_ICON_SRC}
                width={height === "56px" ? "18px" : "14px"}
                style={{ opacity: "0.5" }}
                className="dark:invert"
              />
            </Box>
          )}

          <InputBase
            ref={ref}
            value={search}
            type={type || "text"}
            onChange={handleInputBaseChange}
            sx={getInputBaseSx(inputFontSize)}
            placeholder={placeholder}
            inputProps={{ "aria-label": "Search bar" }}
          />
          {search && (
            <IconButton
              type="button"
              sx={{
                padding: "2px",
                marginRight: "8px",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSearch("");
                if (onChangeFunction) {
                  onChangeFunction("");
                }
                if (clearTriggersSearch) {
                  onSearch("");
                }
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: "18px",
                }}
              />
            </IconButton>
          )}
          {isLoading ? (
            <CircularProgress size={20} color="primary" sx={{ mr: 1 }} />
          ) : submitButtonVariant === "orange-circle" ? (
            <IconButton sx={getOrangeCircleButtonSx(height)} type="submit">
              <SendIcon sx={getOrangeSendIconSx(height)} />
            </IconButton>
          ) : (
            <IconButton
              sx={{
                padding: "5px",
              }}
              type="submit"
            >
              <SendIcon
                sx={{
                  fontSize: "18px",
                  color: "text.secondary",
                }}
              />
            </IconButton>
          )}
        </Paper>
      </Tooltip>
    );
  },
);

export default SearchBar;
