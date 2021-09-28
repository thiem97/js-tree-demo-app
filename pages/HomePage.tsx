import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveData } from "../redux/treeSlice";
import { RootState } from "../redux/store";
import SortableTree, {
  removeNodeAtPath,
  changeNodeAtPath,
  getNodeAtPath,
  addNodeUnderParent,
  insertNode,
  find,
  TreeItem,
  getFlatDataFromTree,
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import MaterialTheme from "react-sortable-tree-theme-material-ui";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import {
  createMuiTheme,
  Divider,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import styles from "./HomePage.module.css";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
const data = [
  {
    title: "Item 1",
    className: "icon-a",
    expanded: true,
    children: [{ title: "Item 1.1", className: "icon-a" }],
  },
  {
    title: "Item 2",
    className: "icon-a",
    expanded: true,
    children: [{ title: "Item 2.1", className: "icon-a" }],
  },
];

function HomePage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.tree.items);
  const [treeData, setTreeData]: any = useState(items);
  const [inputValue, setInputValue] = useState("");
  const [newInputValue, setNewInputValue] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState("");
  const [itemEditing, setItemEditing] = useState(null);
  const [addSibling, setAddsibling] = useState(false);
  const [currItem, setCurrItem] = useState("");
  const [currNode, setCurrNode] = useState();
  const [inputBlur, setInputBlur] = useState(false);
  const [showAdd, setShowAdd] = useState(true);
  const [inputBottomLabel, setInputBottomLabel] = useState(false);
  const [style, setStyle] = useState(false);

  const [addChild, setAddChild] = useState(false);
  //for child input refactor
  const [childInput, setChildInput] = useState(false);
  const [newInputValue2, setNewInputValue2] = useState("");
  const [currItemToAddChild, setCurrItemToAddChild] = useState();
  let inputRef: HTMLInputElement;
  let inputEl: HTMLInputElement;
  let inputElChild: HTMLInputElement;
  let inputElAddNewChild: HTMLInputElement;

  useEffect(() => {
    setCurrItem(editingValue);
  }, [editingValue]);

  useEffect(() => {
    dispatch(saveData(treeData));
  }, [treeData]);

  useEffect(() => {
    function checkClick(e) {
      if (
        inputValue !== "" ||
        (showAdd !== true &&
          !(
            e.path[0].nodeName === "INPUT" ||
            e.path[0].nodeName === "BUTTON" ||
            e.path[0].nodeName === "svg" ||
            e.path[0].nodeName === "path"
          ))
      ) {
        setInputValue("");
        setInputBottomLabel(false);
      }
      console.log(e);
      if (e.type === "mousedown" && e.path[0].nodeName === "P") {
        console.log("trueee");
        setInputValue("");
        setInputBottomLabel(false);
        setShowAdd(true);
      }
      if (
        !(
          e.path[0].nodeName === "P" ||
          e.path[0].nodeName === "INPUT" ||
          e.path[0].nodeName === "BUTTON" ||
          e.path[0].nodeName === "svg" ||
          e.path[0].nodeName === "path"
        )
      ) {
        setEditing(false);
        setAddsibling(false);
        setInputBlur(false);
        setChildInput(false);
        setNewInputValue("");
        setShowAdd(true);
        setInputValue("");
        setInputBottomLabel(false);
      }
    }

    document.addEventListener("mousedown", checkClick);
    return () => {
      document.removeEventListener("mousedown", checkClick);
    };
  }, []);

  const addNewItem = (e: any) => {
    e.preventDefault();
    const key = e.which || e.keyCode;
    if (key === 27) {
      displayAddItem();
      setInputBottomLabel(false);
    }
    if (key === 13 && inputValue !== "") {
      setTreeData(treeData.concat({ title: inputValue,id: Date.now(),eventName:"",url: "" }));
      inputRef?.focus();
      inputRef?.select();
      inputRef.value = "";
      setInputValue("");
      setInputBottomLabel(false);
    }
  };

  const addItemCheck = () => {
    setTreeData(treeData.concat({ title: inputValue }));
    inputRef?.focus();
    inputRef?.select();
    inputRef.value = "";
    setInputValue("");
  };

  const editItem = (item) => {
    setEditing(true);
    setEditingValue(item.title);
    setItemEditing(item);
  };

  const getNodeKey = ({ treeIndex }: any) => treeIndex;

  const checkUpdate = (rowInfo) => {
    const { node, path } = rowInfo;
    const { children } = node;

    const value = inputEl.value;

    let newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        ...node,
        title: value,
        children,
        expanded: true,
      },
    });

    setTreeData(newTree);
  };

  const updateNode = (e, rowInfo) => {
    const key = e.which || e.keyCode;
    const value = inputEl?.value;
    if (key === 27) {
      inputEl?.blur();
      setEditing(false);
    }
    if (key === 13 && editingValue !== "") {
      const { node, path } = rowInfo;
      const { children } = node;
      let newTree = changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          ...node,
          title: value,
          children,
          expanded: true,
        },
      });
      const customSearchMethod = ({ node, searchQuery }) =>
        searchQuery &&
        node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      setEditing(false);
      setAddsibling(true);
      setEditingValue(editingValue);
      let newNode = find({
        getNodeKey,
        treeData: newTree,
        searchQuery: currItem,
        searchMethod: customSearchMethod,
      });
      console.log(rowInfo.node.children === undefined);
      if (rowInfo.node.children === undefined) {
        setAddChild(false);
      } else {
        setAddChild(true);
      }
      setTreeData(newTree);
      console.log(rowInfo);
    }
  };

  const setAddingChildInput = (rowInfo) => {
    console.log(rowInfo.treeIndex);
    setCurrNode(rowInfo.treeIndex);
    setChildInput(true);
  };

  function addNodeChild(e, rowInfo) {
    let { path } = rowInfo;

    const value = newInputValue2;
    const key = e.which || e.keyCode;
    if (key === 8 && newInputValue2 === "") {
      inputElAddNewChild?.blur();
      setChildInput(false);
      setNewInputValue2("");
    }
    if (key === 27) {
      inputElAddNewChild?.blur();
      setChildInput(false);
      setNewInputValue2("");
    }
    if (key === 13 && newInputValue2 !== "") {
      let newTree = addNodeUnderParent({
        treeData: treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: {
          title: value,
          expanded: true,
        },
      });
      setCurrItem(rowInfo.treeIndex);
      setTreeData(newTree.treeData);
      setNewInputValue2("");
      setInputBottomLabel(false);
    }
  }

  function addNodeChildWithCheck(e, rowInfo) {
    let { path } = rowInfo;

    var sibling: any = getNodeAtPath({
      treeData: treeData,
      path,
      getNodeKey,
      ignoreCollapsed: false,
    });

    var youngerSibling: any = true;

    let newTree = insertNode({
      treeData: treeData,
      depth: path.length,
      minimumTreeIndex: sibling.treeIndex + youngerSibling,
      newNode: {
        title: newInputValue2,
        expanded: true,
      },
      getNodeKey,
      ignoreCollapsed: false,
      expandParent: true,
    });
    setTreeData(newTree.treeData);
    setCurrNode(sibling.treeIndex);
    setNewInputValue2("");
    inputElAddNewChild.focus();
  }

  const removeAddItem = () => {
    setShowAdd(false);
  };

  const displayAddItem = (): void => {
    inputRef.value = "";
    setInputValue("");
    setShowAdd(true);
    setInputBottomLabel(false);
  };

  const [currentDraggingNode, setCurrentDraggingNode] = useState(null);

  const setStyleWhileDragging = ({ isDragging, draggedNode }) => {
    if (isDragging) {
      setStyle(true);
      setCurrentDraggingNode(draggedNode);
    } else {
      setStyle(false);
      setCurrentDraggingNode(null);
    }
  };

  return (
    <div
      style={{
        height: "auto",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <SortableTree
        onDragStateChanged={setStyleWhileDragging}
        isVirtualized={false}
        theme={MaterialTheme}
        treeData={treeData}
        onChange={(treeData: any) => setTreeData(treeData)}
        generateNodeProps={(rowInfo) => ({
          title: (
            <>
              <div className="flex flex-col" style={{ padding: "0px" }}>
                <div style={{ padding: "0px !important" }}>
                  {isEditing && showAdd && itemEditing === rowInfo.node ? (
                    <div>
                      <Divider
                        style={{
                          zIndex: 100,
                          width: "480px",
                          marginLeft: "-5px",
                        }}
                      />
                      <div
                        className="flex items-center w-full my-1"
                        style={{
                          width: `${450 - rowInfo.path.length * 25}px`,
                          height: "23px",
                        }}
                      >
                        <input
                          autoFocus
                          type="text"
                          ref={(node) => {
                            if (node) {
                              inputEl = node;
                            }
                          }}
                          value={editingValue}
                          onClick={(e) => {
                            setEditing(true);
                          }}
                          onChange={(e) => {
                            setEditingValue(
                              (e.target as HTMLInputElement).value
                            );
                          }}
                          className="flex-1 w-full truncate"
                          onKeyUp={(e) => {
                            updateNode(e, rowInfo);
                          }}
                          style={{
                            background: "transparent",
                            outline: "none",
                            border: "none",
                            margin: "0px 20px",
                            letterSpacing: "0.12pt !important",
                            color: "212121",
                            cursor: "text",
                          }}
                        />
                        <div className="absolute right-0 flex">
                          <div className="order-1">
                            <IconButton
                              className={styles.deleteIconRippleInput}
                              onClick={(e) => checkUpdate(rowInfo)}
                            >
                              <Tooltip
                                title="Done"
                                placement="bottom"
                                enterDelay={750}
                                classes={{
                                  tooltip: styles.tooltipStyles,
                                }}
                              >
                                <CheckIcon
                                  className={`base-input-class ${styles.editIconInput} ${styles.show}`}
                                  onClick={(e) => checkUpdate(rowInfo)}
                                />
                              </Tooltip>
                            </IconButton>
                          </div>
                          <div className="order-2">
                            <IconButton
                              className={styles.deleteIconRippleInput}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditing(false);
                                e.currentTarget.blur();
                              }}
                            >
                              <Tooltip
                                title="Cancel"
                                placement="bottom"
                                enterDelay={750}
                                classes={{
                                  tooltip: styles.tooltipStyles,
                                }}
                              >
                                <ClearIcon
                                  className={`base-input-class ${styles.deleteIconInput} ${styles.show}`}
                                />
                              </Tooltip>
                            </IconButton>
                          </div>
                        </div>
                      </div>
                      <Divider
                        style={{
                          width: "480px",
                          zIndex: 100,
                          marginLeft: "-5px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex justify-between"
                      // style={{
                      //   width: "480px",
                      //   boxShadow:
                      //     "0 -5px 5px -5px rgba(0, 0, 0, 0.4), 0px 5px 5px -5px rgba(0, 0, 0, 0.4)",
                      // }}
                    >
                      <div
                        className="flex"
                        style={{
                          height: "33px",
                          padding: "0px",
                        }}
                      >
                        <i
                            className={`self-center material-icons hide`}
                          style={{ fontSize: 18, color: "#757575" }}
                        >
                          drag_indicator
                        </i>
                        <div
                          style={{
                            width: `${370 - rowInfo.path.length * 20}px`,
                            padding: "0px 2px",
                            cursor: "pointer",
                              //color: "#212121 !important",
                            
                            // boxShadow:
                            //   "0 -5px 5px -5px rgba(0, 0, 0, 0.4), 0px 5px 5px -5px rgba(0, 0, 0, 0.4)",
                          }}
                          className={`self-center w-full truncate itemName ${
                            style && rowInfo.node === currentDraggingNode
                              ? "opacity-100 shadow-custom !z-custom !cursor-pointer"
                              : ""
                          }`}
                          onClick={(e) => {
                            editItem(rowInfo.node);
                          }}
                        >
                          {rowInfo.node.title}
                        </div>
                      </div>
                      <div
                        className="absolute right-0 flex self-center hide"
                        style={style ? { opacity: 0 } : { opacity: 1 }}
                      >
                        <div className="order-1">
                          <IconButton
                            className={styles.deleteIconRippleInput}
                            onClick={() => setAddingChildInput(rowInfo)}
                          >
                            <Tooltip
                              title="New child item"
                              placement="bottom"
                              enterDelay={750}
                              classes={{
                                tooltip: styles.tooltipStyles,
                              }}
                            >
                              <AddIcon className={styles.iconStyling} />
                            </Tooltip>
                          </IconButton>
                        </div>
                        <div className="order-2">
                          {" "}
                          <IconButton className={styles.deleteIconRippleInput}>
                            <Tooltip
                              title="Edit"
                              placement="bottom"
                              enterDelay={750}
                              classes={{
                                tooltip: styles.tooltipStyles,
                              }}
                            >
                              <EditOutlinedIcon
                                className={styles.iconStyling}
                              />
                            </Tooltip>
                          </IconButton>
                        </div>
                        <div className="order-3">
                          <IconButton
                            disabled={treeData.length === 1}
                            onClick={() =>
                              setTreeData((treeData: any) =>
                                removeNodeAtPath({
                                  treeData: treeData,
                                  path: rowInfo.path,
                                  getNodeKey,
                                })
                              )
                            }
                            className={styles.deleteIconRippleInput}
                          >
                            <Tooltip
                              title="Delete"
                              placement="bottom"
                              enterDelay={750}
                              classes={{
                                tooltip: styles.tooltipStyles,
                              }}
                            >
                              <DeleteOutlineOutlinedIcon
                                className={styles.iconStyling}
                              />
                            </Tooltip>
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {childInput && currNode === rowInfo.treeIndex ? (
                    <div>
                      <Divider
                        style={{
                          zIndex: 100,
                          width: "480px",
                          marginLeft: "20px",
                        }}
                      />
                      <div
                        className="flex items-center w-full my-1"
                        style={{
                          width: `${480 - rowInfo.path.length * 20}px`,
                          height: "25px",
                        }}
                      >
                        <input
                          autoFocus
                          type="text"
                          placeholder="+ New child"
                          ref={(node) => {
                            if (node) {
                              inputElAddNewChild = node;
                            }
                          }}
                          value={newInputValue2}
                          onChange={(e) => {
                            setNewInputValue2(
                              (e.target as HTMLInputElement).value
                            );
                          }}
                          onKeyUp={(e) => {
                            addNodeChild(e, rowInfo);
                          }}
                          className="w-full truncate"
                          style={{
                            background: "transparent",
                            outline: "none",
                            border: "none",
                            cursor: "text",
                            marginLeft: "45px",
                            fontWeight: 400,
                          }}
                        />
                        <div className="absolute right-0 flex">
                          <IconButton
                            className={styles.deleteIconRippleInput}
                            disabled={newInputValue2 ? false : true}
                            onClick={(e) => {
                              addNodeChildWithCheck(e, rowInfo);
                            }}
                          >
                            <Tooltip
                              title="Done"
                              placement="bottom"
                              enterDelay={750}
                              classes={{
                                tooltip: styles.tooltipStyles,
                              }}
                            >
                              <CheckIcon
                                className={`base-input-class ${styles.editIconInput} ${styles.show}`}
                              />
                            </Tooltip>
                          </IconButton>

                          <IconButton
                            className={styles.deleteIconRippleInput}
                            onClick={(e) => {
                              e.stopPropagation();
                              setChildInput(false);
                              e.currentTarget.blur();
                              setNewInputValue2("");
                            }}
                          >
                            <Tooltip
                              title="Cancel"
                              placement="bottom"
                              enterDelay={750}
                              classes={{
                                tooltip: styles.tooltipStyles,
                              }}
                            >
                              <ClearIcon
                                className={`base-input-class ${styles.deleteIconInput} ${styles.show}`}
                              />
                            </Tooltip>
                          </IconButton>
                        </div>
                      </div>
                      <Divider
                        style={{
                          width: "480px",
                          zIndex: 100,
                          marginLeft: "20px",
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ),
        })}
      />
      <div
        style={{
          width: "480px",
          background: "rgba(0,0,0,0.04)",
          padding: "3px 0 18px 25px",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          alignItems: "center",
        }}
      >
        {showAdd && (
          <p
            onClick={removeAddItem}
            style={{
              cursor: "pointer",
              margin: "2px 0 -3px -1px",
              color: "#9e9e9e",
              fontSize: "15px",
              lineHeight: "24px",
              fontWeight: 400,
              height: "33px",
              letterSpacing: "0.12pt",
            }}
          >
            + New item
          </p>
        )}
        {!showAdd && !childInput ? (
          <>
            <div>
              <Divider
                style={{
                  marginLeft: "-25px",
                  zIndex: 100,
                  width: "480px",
                }}
              />
              <div style={{ height: "30px" }}>
                <input
                  ref={(node) => {
                    if (node) {
                      inputRef = node;
                    }
                  }}
                  type="text"
                  placeholder="+ New item"
                  autoFocus
                  defaultValue={inputValue}
                  onKeyUp={addNewItem}
                  onChange={(e) => {
                    setInputValue((e.target as HTMLInputElement).value);
                    setInputBottomLabel(inputRef.value !== "" ? true : false);
                  }}
                  onClick={() => {
                    setEditing(false);
                    setInputBlur(true);
                    setAddsibling(false);
                  }}
                  className="inputStyle"
                  style={{
                    background: "transparent",
                    outline: "none",
                    border: "none",
                    letterSpacing: "0.12pt",
                    color: "#212121",
                    cursor: "text",
                    margin: "2px 0 0 1px",
                    fontWeight: 400,
                    width: "380px",
                  }}
                />

                {inputValue !== "" ? (
                  <div style={{ alignSelf: "center" }}>
                    <IconButton
                      className={styles.deleteIconRippleInput}
                      onClick={(e) => addItemCheck()}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "40px",
                      }}
                    >
                      <Tooltip
                        title="Done"
                        placement="bottom"
                        enterDelay={750}
                        classes={{
                          tooltip: styles.tooltipStyles,
                        }}
                      >
                        <CheckIcon
                          className={`base-input-class ${styles.editIconInput} ${styles.show}`}
                        />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      className={styles.deleteIconRippleInput}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "10px",
                      }}
                      onClick={(e) => {
                        e.currentTarget.blur();
                        displayAddItem();
                        setInputBottomLabel(false);
                      }}
                    >
                      <Tooltip
                        title="Cancel"
                        placement="bottom"
                        enterDelay={750}
                        classes={{
                          tooltip: styles.tooltipStyles,
                        }}
                      >
                        <ClearIcon
                          className={`base-input-class ${styles.deleteIconInput} ${styles.show}`}
                        />
                      </Tooltip>
                    </IconButton>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <Divider
                style={{
                  marginLeft: "-25px",
                  zIndex: 100,
                }}
              />
              {inputBottomLabel && (
                <div
                  style={{
                    cursor: "pointer",
                    marginTop: "2px",
                    color: "#9e9e9e",
                    fontSize: "15px",
                    lineHeight: "24px",
                    fontWeight: 400,
                    height: "33px",
                  }}
                >
                  + New item
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default HomePage;
