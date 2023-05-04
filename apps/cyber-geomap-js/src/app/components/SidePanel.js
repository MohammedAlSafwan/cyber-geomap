import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import React from 'react';
import DarkPaper from '../styled/DarkPaper';

// interface TreeNode {
//     key: string;
//     name: string;
//     handleClick: () => void;
//     isOpen?: boolean;
//     children?: TreeNode[];
//     depth: number;
// }

// interface SidePanelProps {
//     data: any;
// }

const createTreeNode = (key, value, depth = 0, name) => {
    const node = {
        key,
        name: name.charAt(0).replace('_', '').charAt(0).toUpperCase() + name.slice(1),
        handleClick: () => { return },
        depth
    };

    if (typeof value === 'object' && value !== null) {
        node.children = Object.entries(value).map(([childKey, childValue]) =>
            createTreeNode(`${key}.${childKey}`, childValue, depth + 1, childKey)
        );
        node.isOpen = false;
        node.handleClick = () => {
            node.isOpen = !node.isOpen;
        };
    } else {
        node.name += `: ${value}`;
    }
    return node;
};

const createTreeData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return [];
    }

    return Object.entries(data).map(([key, value]) =>
        createTreeNode(key, value, 1, key)
    );
};

const SidePanel = ({ data }) => {
    const [treeData, setTreeData] = React.useState(null);
    const [openNodes, setOpenNodes] = React.useState(new Set());

    React.useEffect(() => {
        if (data) setTreeData(createTreeData(data));
    }, [data]);

    const handleNodeClick = (key) => {
        const newOpenNodes = new Set(openNodes);
        if (newOpenNodes.has(key)) {
            newOpenNodes.delete(key);
        } else {
            newOpenNodes.add(key);
        }
        setOpenNodes(newOpenNodes);
    };

    const renderTree = (node) => (
        <div key={node.key}>
            <ListItem
                button
                onClick={() => {
                    if (node.children) {
                        handleNodeClick(node.key);
                    }
                }}
                sx={{ paddingLeft: `${4 * node.depth}ch` }}
            >
                <ListItemIcon>
                    {node.children ? (
                        openNodes.has(node.key) ? (
                            <KeyboardArrowDown />
                        ) : (
                            <KeyboardArrowRight />
                        )
                    ) : null}
                </ListItemIcon>
                <ListItemText primary={node.name} sx={{ color: 'white' }} />
            </ListItem>
            {node.children && (
                <Collapse in={openNodes.has(node.key)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((child) => renderTree(child))}
                    </List>
                </Collapse>
            )}
        </div>
    );

    const handleClose = () => {
        setTreeData(null);
    };

    return treeData ? (
        <DarkPaper
            sx={{
                position: 'absolute',
                right: '0px',
                top: '16px',
                bottom: '16px',
                width: '500px',
                overflowY: 'scroll',
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    minHeight: '100%',
                }}
            >
                <IconButton edge="end" color="inherit" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <List component="nav" dense>
                    {treeData.map((node) => renderTree(node))}
                </List>
            </Box>
        </DarkPaper>
    ) : null;
};

export default SidePanel;