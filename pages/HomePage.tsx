import React,{useState,useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {saveData } from '../redux/treeSlice';
import { RootState } from '../redux/store';
import SortableTree, { removeNodeAtPath,changeNodeAtPath,getNodeAtPath,addNodeUnderParent,insertNode ,find, TreeItem, getFlatDataFromTree} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import MaterialTheme from 'react-sortable-tree-theme-material-ui';
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { Divider, IconButton, Tooltip } from '@material-ui/core';
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import styles from './HomePage.module.css';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
const data = [
  { title: 'Item 1', className:"icon-a",expanded: true, children: [{ title: 'Item 1.1', className:"icon-a" }] },
  { title: 'Item 2', className:"icon-a",expanded: true, children: [{ title: 'Item 2.1',className:"icon-a" }] },
]



function HomePage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.tree.items)
  const [treeData, setTreeData]:any = useState(items );
  const [inputValue, setInputValue] = useState("");
  const [newInputValue, setNewInputValue] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState("");
  const [itemEditing, setItemEditing] = useState(null);
  const [addSibling, setAddsibling] = useState(false);
  const [currItem, setCurrItem] = useState("");
  const [currNode, setCurrNode] = useState();
  const [inputBlur, setInputBlur] = useState(false);
  const [addChild, setAddChild] = useState(false);
  let inputRef: HTMLInputElement;
  let inputEl: HTMLInputElement;
  let inputElChild:  HTMLInputElement;
  const add = (e: any) => {
     e.preventDefault();
    const key = e.which || e.keyCode;
    if (key === 13 && inputValue !== "") {

      setTreeData(treeData.concat({title: inputValue}))
      inputRef?.focus();
      inputRef?.select();
      inputRef.value = "";
      setInputValue("");
    }
  }

  const addItemCheck = () => {
     setTreeData(treeData.concat({title: inputValue}))
      inputRef?.focus();
      inputRef?.select();
    inputRef.value = "";
    setInputValue("");
  }

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
        title: value,
        children,
        expanded: true
      }
    });


       
    setTreeData(newTree);
  }



  let currNode2;
  
  const updateNode = (e, rowInfo) => {
    const key = e.which || e.keyCode;
    const value = inputEl?.value;
    if (key === 13 && editingValue !== "") {
      const { node, path } = rowInfo;
      const { children } = node;
      //const value = inputEl.value;

     

      let newTree = changeNodeAtPath({
        treeData,
        path,
        getNodeKey,
        newNode: {
          title: value,
          children,
          expanded:true
        }
      });
      const customSearchMethod = ({ node, searchQuery }) =>
      searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      setEditing(false);
      setAddsibling(true);
      setEditingValue(editingValue);
      //console.log(editingValue)
      let newNode = find({
        getNodeKey,
        treeData:newTree,
        searchQuery:currItem,
        searchMethod:customSearchMethod,        
      })
      //console.log(newNode)
      //setCurrNode(newNode.matches[0].treeIndex);
      setCurrNode(rowInfo.treeIndex);
      console.log(rowInfo.node.children === undefined)
      if (rowInfo.node.children === undefined) {
        setAddChild(false);
      } else {
        setAddChild(true);
      }
      //currNode2 = newNode.matches[0].treeIndex;
      //console.log(currNode2);
      setTreeData(newTree);
    }
  }
  

  //  const addInput = (e, rowInfo) => {
  //    //const { node, path } = rowInfo;
  //    //const { children } = node;
  //     //e.preventDefault();
  //     //const key = e.which || e.keyCode;
     
      
    
  //      setAddsibling(true);
  //     //setCurrItem(newNode);
  //    console.log(newNode);
  //    setEditing(false);
  //  }
  
  useEffect(() => {
    setCurrItem(editingValue)
  },[editingValue])

  function addNodeSibling(e, rowInfo) {
    //e.preventDefault();
    const key = e.which || e.keyCode;
    if (key === 13 && newInputValue !== "") {
      let { node,path } = rowInfo;
      const { children } = node;

      const value = inputElChild.value;

      // let newTree = addNodeUnderParent({
      //   treeData: treeData,
      //   parentKey: path[path.length - 2],
      //   expandParent: true,
      //   getNodeKey,
      //   newNode: {
      //     title: newInputValue,
      //    children:[],
      //     expanded:true
      //   }
        
      // });

      var sibling:any = getNodeAtPath({
                  treeData:treeData,
                  path,
                  getNodeKey,
                  ignoreCollapsed: false,
      })

      var youngerSibling: any = true;

      let newTree = insertNode({
        treeData: treeData,
        depth: path.length - 1,
        minimumTreeIndex: sibling.treeIndex + youngerSibling,
        newNode: {
          title: value,
          
          expanded:true
        },
        ignoreCollapsed: false,
        expandParent: false,
      });
       

      const pob = rowInfo.node.children?  rowInfo.node.children.length : 0;
      
      setTreeData(newTree.treeData);
      
      if (!addChild) {
        setCurrNode(sibling.treeIndex + 1)
      }
      if (addChild) {
        setCurrNode(sibling.treeIndex + pob + 1)
      }
      inputElChild.value = "";
      setNewInputValue("")
    }
  }


  const addItemWithCheck = (e, rowInfo) => {
    e.preventDefault();
    e.stopPropagation();
    let { node,path } = rowInfo;
      const { children } = node;

      const value = newInputValue;

      // let newTree = addNodeUnderParent({
      //   treeData: treeData,
      //   parentKey: path[path.length - 2],
      //   expandParent: true,
      //   getNodeKey,
      //   newNode: {
      //     title: newInputValue,
      //    children:[],
      //     expanded:true
      //   }
        
      // });

      var sibling:any = getNodeAtPath({
                  treeData:treeData,
                  path,
                  getNodeKey,
                  ignoreCollapsed: false,
      })

      var youngerSibling:any = true;

      let newTree = insertNode({
        treeData: treeData,
        depth: path.length - 1,
        minimumTreeIndex: sibling.treeIndex + youngerSibling,
        newNode: {
          title: value,
          expanded:true
        },
        ignoreCollapsed: false,
        expandParent: true,
      });
       
      
    setTreeData(newTree.treeData);
    
    const pob = rowInfo.node.children?  rowInfo.node.children.length : 0;
      
      setTreeData(newTree.treeData);
      
      if (!addChild) {
        setCurrNode(sibling.treeIndex + 1)
      }
      if (addChild) {
        setCurrNode(sibling.treeIndex + pob + 1)
      }

    inputElChild.focus();
    setNewInputValue("");
  }
  

  useEffect(() => {
    // setTreeData(items)
    dispatch(saveData(treeData))
  }, [treeData]);

  useEffect(() => {
    function checkClick(e) {
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
        setNewInputValue("")
      }
    }

    document.addEventListener("mousedown", checkClick);
    return () => {
      document.removeEventListener("mousedown", checkClick);
    };
  }, [])

 
  return (
    <div style={{ height: 'auto', overflowX: 'hidden', overflowY: 'auto',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',position:'relative' }}>
      <SortableTree isVirtualized={false} theme={MaterialTheme} treeData={treeData} onChange={(treeData: any) => setTreeData(treeData)} generateNodeProps={
        (rowInfo) => ({
          buttons: (
            <div className="">
              {isEditing && itemEditing === rowInfo.node ? (
                <div className="flex">
                  <div className="order-1">
                    <IconButton
                  className={
                    styles.deleteIconRippleInput
                  }
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
              ) : <div className="flex hide">
                  <div className="order-1">
                    <IconButton
                className={
                  styles.deleteIconRippleInput
                }
              >
                                        
                <Tooltip
                  title="New child item"
                  placement="bottom"
                  enterDelay={750}
                  classes={{
                    tooltip:
                      styles.tooltipStyles,
                  }}
                >
                  <AddIcon className={styles.iconStyling} />
                </Tooltip>
              </IconButton>
                </div>
                 <div className="order-2"> <IconButton
                className={
                  styles.deleteIconRippleInput
                }
              >
                                        
                <Tooltip
                  title="Edit"
                  placement="bottom"
                  enterDelay={750}
                  classes={{
                    tooltip:
                      styles.tooltipStyles,
                  }}
                >
                  <EditOutlinedIcon className={styles.iconStyling} />
                </Tooltip>
                  </IconButton>
                    </div>
                  <div className="order-3">
                    <IconButton
                  disabled={treeData.length === 1}
                  onClick={() => setTreeData((treeData: any) => removeNodeAtPath({
                    treeData: treeData,
                    path: rowInfo.path,
                    getNodeKey
                  }))}
                  className={
                    styles.deleteIconRippleInput
                  }
                >
                                        
                  <Tooltip
                    title="Delete"
                    placement="bottom"
                    enterDelay={750}
                    classes={{
                      tooltip:
                        styles.tooltipStyles,
                    }}
                  >
                    <DeleteOutlineOutlinedIcon className={styles.iconStyling} />
                  </Tooltip>
                </IconButton>
                </div>
              </div>}
            </div>
          ),
          icons: (
            <i className='material-icons'
        style={{ fontSize: 18,color:'#757575'  }}>
                  drag_indicator
                </i>
              ),
              title: (
              <>
              {
                    isEditing && itemEditing === rowInfo.node ? <>
                      <div style={{ width: '480px', position: 'absolute', bottom: '0px',top:'8px', background: 'rgba(158, 158, 158, 1)', height: '1px', left: '0px' }}></div>
                      <div style={{ width: '480px', position: 'absolute', bottom: '12px', background: 'rgba(158, 158, 158, 1)', height: '1px', left: '0px' }}></div>
                      <input
                        autoFocus
                        type="text"
                        ref={(node) => {
                          if (node) {
                            inputEl = node;
                          }
                        }}
                        value={editingValue}
                        onClick={(e) => { setEditing(true); }}
                        onChange={(e) => {
                          setEditingValue(
                            (e.target as HTMLInputElement).value
                          );
                        }}
                      
                      
                      onKeyUp={(e) => {
                        updateNode(e, rowInfo);
                      }}
                      //onBlur={(e) => { setEditing(false);}}
                       //className="inputStyle"
                      style={{ background: 'transparent', width: '480px',outline:'none',border:'none',cursor:'pointer'}}
                    />
                      </>
                      : <span className='w-full itemName' onClick={(e) => { editItem(rowInfo.node);}}>
                        {rowInfo.node.title}</span>
                      
                        
                  }
                
                  {addSibling && currNode === rowInfo.treeIndex ? (
                    <>
                      {/* <Divider className="proba" style={{ position: 'absolute', top: '29px !important', width: '500px' }} /> */}
                      <div style={{ width: '480px', position: 'absolute', bottom: '12px', background: 'rgba(158, 158, 158, 1)', height: '1px', left: '0px' }}></div>
                       <div style={{width:'480px',position: 'absolute',bottom:'-10px',background:'rgba(158, 158, 158, 1)',height:'1px',left:'0px'}}></div>
                    <div className="flex ">
                     <input
                        autoFocus
                        type="text"
                        //onBlur={(e) => setAddsibling(false)}
                        placeholder="+New item"
                        ref={(node) => {
                          if (node) {
                            inputElChild = node;
                          }
                        }}
                      value={newInputValue}
                      onChange={(e) => {
                        setNewInputValue(
                          (e.target as HTMLInputElement).value
                        )
                      }}
                        onKeyUp={(e) => {
                          addNodeSibling(e, rowInfo);
                        }}
                     className="proba"
                      style={{ background: 'transparent', width: '480px',height:'30px',outline:'none',border:'none',cursor:'pointer'}}
                    />
                      {
                        // newInputValue && (
                            <div>
                              <IconButton
                                      className={
                          styles.deleteIconRippleInput
                        }
                              disabled={newInputValue ? false : true}
                        style={{ position: 'absolute', top: '30px', right: '40px'}}
                        onClick={(e) => { addItemWithCheck(e,rowInfo);}}
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
                            onClick={(e) => { addItemWithCheck(e,rowInfo);}}
                          className={`base-input-class ${styles.editIconInput} ${styles.show}`}
                                        />
                                      </Tooltip>
                          </IconButton>
                             <IconButton
                  className={styles.deleteIconRippleInput}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddsibling(false);
                    e.currentTarget.blur();
                    setNewInputValue("");
                  }}
                              style={{ position: 'absolute', top: '30px', right: '10px' }}
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
                        // )
                    }
                      </div>
                      </>
                  ) : ""}
                
                              
              </>
              )
            })
          } />
      <div style={{ width: '480px', background: 'rgba(0,0,0,0.04)', padding:'10px',display:'flex',justifyContent:'space-between',position:'relative',alignItems:'center'}}>
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
                onKeyUp={add}
                onChange={(e) => {
                  setInputValue((e.target as HTMLInputElement).value);
                }}
          
          onClick={() => { setEditing(false); setInputBlur(true); setAddsibling(false);}}
        className="inputStyle"
        style={{ background:'transparent',outline:'none',border:'none',width:'390px'}}
        />
        {inputValue !== "" ? <div style={{alignSelf:'center'}}><IconButton
                                      className={
                      styles.deleteIconRippleInput
                    }
                    onClick={(e) => addItemCheck()}
          style={{ position: 'absolute', top: '5px', right: '40px' }}
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
            style={{ position: 'absolute', top: '5px', right: '10px' }}
            onClick={(e) => {
              setInputValue("");
              inputRef.value = "";
              setInputBlur(false);
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
         : ""}
     </div>
    </div>
  )
}

export default HomePage
