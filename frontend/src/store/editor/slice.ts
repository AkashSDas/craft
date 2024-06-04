import {
    Block,
    BlockId,
    Divider,
    Heading,
    Image,
    Paragraph,
} from "@app/services/articles";
import { createId } from "@app/utils/ids";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

// ===================================
// Blocks
// ===================================

export const blocks: Block["type"][] = [
    "paragraph",
    "heading",
    "divider",
    "image",
] as const;

class BlockManager {
    static createParagraph(): Paragraph {
        return {
            blockId: createId("blk"),
            type: "paragraph",
            value: { text: "" },
        };
    }

    static createHeading(variant: Heading["value"]["variant"]): Heading {
        return {
            blockId: createId("blk"),
            type: "heading",
            value: { text: "", variant },
        };
    }

    static createDivider(): Divider {
        return {
            blockId: createId("blk"),
            type: "divider",
            value: {},
        };
    }

    static createImage(URL: string, caption?: string): Image {
        return {
            blockId: createId("blk"),
            type: "image",
            value: { URL, caption },
        };
    }
}

// ===================================
// Blocks
// ===================================

type EditorState = {
    initialPopulateEditorDone: boolean;
    blockIds: BlockId[];
    blocks: Record<BlockId, Block>;
    addedBlocks: BlockId[];
    deletedBlocks: BlockId[];
    changedBlocks: BlockId[];
    files: Record<BlockId, File>;
};

const initialState: EditorState = {
    initialPopulateEditorDone: false,
    blockIds: [],
    blocks: {},
    addedBlocks: [],
    deletedBlocks: [],
    changedBlocks: [],
    files: {},
};

// ===================================
// Reducers payload types
// ===================================

type PopulateEditorAction = {
    payload: Pick<EditorState, "blockIds" | "blocks">;
};

type AddBlockAction = {
    payload: {
        blockType: Block["type"];
        afterBlockId?: BlockId;
        additionalData?: Record<string, any>;
    };
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        /** Initialize the editor with the given blocks */
        populateEditor(state, action: PopulateEditorAction) {
            const { blockIds, blocks } = action.payload;
            if (state.initialPopulateEditorDone) return;
            state.blockIds = blockIds;
            state.blocks = blocks;
        },
        /** Add a new block to the editor */
        addBlock(state, action: AddBlockAction) {
            const { blockType, afterBlockId, additionalData } = action.payload;
            const newBlockId = createId("blk");

            let block: Block;
            switch (blockType) {
                case "paragraph":
                    block = BlockManager.createParagraph();
                    break;
                case "heading":
                    block = BlockManager.createHeading(additionalData!.variant);
                    break;

                case "divider":
                    block = BlockManager.createDivider();
                    break;
                case "image":
                    block = BlockManager.createImage("");
                    break;
            }

            state.addedBlocks.push(newBlockId);
            state.blocks[newBlockId] = { ...block, blockId: newBlockId };
            if (afterBlockId) {
                const afterBlockIdx = state.blockIds.indexOf(afterBlockId);
                state.blockIds.splice(afterBlockIdx + 1, 0, newBlockId);
            } else {
                state.blockIds.push(newBlockId);
            }
        },
        deleteBlock(state, action: { payload: BlockId }) {
            const blockId = action.payload;
            const blockIdx = state.blockIds.indexOf(blockId);
            state.deletedBlocks.push(blockId);
            state.blockIds.splice(blockIdx, 1);
            delete state.blocks[blockId];
        },
        updateImageBlock(
            state,
            action: { payload: { blockId: BlockId; file: File } }
        ) {
            const { blockId, file } = action.payload;
            const block = state.blocks[blockId];
            if (block?.type !== "image") return;
            block.value.URL = URL.createObjectURL(file);
            state.files[blockId] = file;
            state.changedBlocks.push(blockId);
        },
        updateParagraphBlock(
            state,
            action: { payload: { blockId: BlockId; text: string } }
        ) {
            const { blockId, text } = action.payload;
            const block = state.blocks[blockId];
            if (block?.type !== "paragraph") return;
            block.value.text = text;
            state.changedBlocks.push(blockId);
        },
        updateHeadingBlock(
            state,
            action: { payload: { blockId: BlockId; text: string } }
        ) {
            const { blockId, text } = action.payload;
            const block = state.blocks[blockId];
            if (block?.type !== "heading") return;
            block.value.text = text;
            state.changedBlocks.push(blockId);
        },
    },
});

// ===================================
// Selectors
// ===================================

export const selectBlockIds = (state: RootState) => state.editor.blockIds;
export const selectBlocks = (state: RootState) => state.editor.blocks;
export const selectBlock = (state: RootState, blockId: BlockId) => {
    return state.editor.blocks[blockId];
};
export const selectFile = (state: RootState, blockId: BlockId) => {
    return state.editor.files[blockId];
};
export const selectFiles = (state: RootState) => {
    return state.editor.files;
};
export const selectBlockChanges = (state: RootState) => {
    return {
        addedBlocks: state.editor.addedBlocks,
        deletedBlocks: state.editor.deletedBlocks,
        changedBlocks: state.editor.changedBlocks,
    };
};

// ===================================
// Export actions
// ===================================

export const {
    populateEditor,
    addBlock,
    updateParagraphBlock,
    updateHeadingBlock,
    deleteBlock,
    updateImageBlock,
} = editorSlice.actions;
