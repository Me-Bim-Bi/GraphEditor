(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/graphDataSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "graphDataSlice",
    ()=>graphDataSlice,
    "selectGraphData",
    ()=>selectGraphData,
    "updateData",
    ()=>updateData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const graphDataSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'graphData',
    initialState: {
        value: ''
    },
    reducers: {
        updateData: (state, action)=>{
            state.value = action.payload;
        }
    }
});
const selectGraphData = (state)=>state.graphData.value;
const { updateData } = graphDataSlice.actions;
const __TURBOPACK__default__export__ = graphDataSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/buttonsEnableSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buttonEnableSlice",
    ()=>buttonEnableSlice,
    "default",
    ()=>__TURBOPACK__default__export__,
    "selectAnalysisModalOpen",
    ()=>selectAnalysisModalOpen,
    "selectButtonEnable",
    ()=>selectButtonEnable,
    "updateAnalysisModalOpen",
    ()=>updateAnalysisModalOpen,
    "updateButtonEnable",
    ()=>updateButtonEnable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const buttonEnableSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'buttonEnable',
    initialState: {
        value: false,
        analysisModalOpen: false
    },
    reducers: {
        updateButtonEnable: (state, action)=>{
            state.value = action.payload;
        },
        updateAnalysisModalOpen: (state, action)=>{
            state.analysisModalOpen = action.payload;
        }
    }
});
const selectButtonEnable = (state)=>state.buttonEnable.value;
const selectAnalysisModalOpen = (state)=>state.buttonEnable.analysisModalOpen;
const { updateButtonEnable, updateAnalysisModalOpen } = buttonEnableSlice.actions;
const __TURBOPACK__default__export__ = buttonEnableSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/hierarchyEnableSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "hierarchyEnableSlice",
    ()=>hierarchyEnableSlice,
    "selectHierarchyEnable",
    ()=>selectHierarchyEnable,
    "updateHierarchyEnable",
    ()=>updateHierarchyEnable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const hierarchyEnableSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'hierarchyEnable',
    initialState: {
        value: false
    },
    reducers: {
        updateHierarchyEnable: (state, action)=>{
            state.value = action.payload;
        }
    }
});
const selectHierarchyEnable = (state)=>state.hierarchyEnable.value;
const { updateHierarchyEnable } = hierarchyEnableSlice.actions;
const __TURBOPACK__default__export__ = hierarchyEnableSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/actionHistorySlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actionHistorySlice",
    ()=>actionHistorySlice,
    "default",
    ()=>__TURBOPACK__default__export__,
    "selectBackward",
    ()=>selectBackward,
    "selectForward",
    ()=>selectForward,
    "updateBackward",
    ()=>updateBackward,
    "updateForward",
    ()=>updateForward
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const actionHistorySlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'actionHistory',
    initialState: {
        forward: [],
        backward: []
    },
    reducers: {
        updateBackward: (state, action)=>{
            state.backward = action.payload;
        },
        updateForward: (state, action)=>{
            state.forward = action.payload;
        }
    }
});
const selectForward = (state)=>state.actionHistory.forward;
const selectBackward = (state)=>state.actionHistory.backward;
const { updateForward } = actionHistorySlice.actions;
const { updateBackward } = actionHistorySlice.actions;
const __TURBOPACK__default__export__ = actionHistorySlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/nodeFilterSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nodeFilterSlice",
    ()=>nodeFilterSlice,
    "selectNodeFilter",
    ()=>selectNodeFilter,
    "updateNodeFilter",
    ()=>updateNodeFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const nodeFilterSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'nodeFilter',
    initialState: {
        value: []
    },
    reducers: {
        updateNodeFilter: (state, action)=>{
            state.value = action.payload;
        }
    }
});
const selectNodeFilter = (state)=>state.nodeFilter.value;
const { updateNodeFilter } = nodeFilterSlice.actions;
const __TURBOPACK__default__export__ = nodeFilterSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/@reduxjs+toolkit@2.9.0_react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1__react@19.1.0/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$graphDataSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/graphDataSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$buttonsEnableSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/buttonsEnableSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$hierarchyEnableSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/hierarchyEnableSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$actionHistorySlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/actionHistorySlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$nodeFilterSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/features/nodeFilterSlice.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f40$reduxjs$2b$toolkit$40$2$2e$9$2e$0_react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        graphData: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$graphDataSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        buttonEnable: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$buttonsEnableSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        hierarchyEnable: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$hierarchyEnableSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        actionHistory: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$actionHistorySlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        nodeFilter: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$features$2f$nodeFilterSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_$40$babel$2b$core$40$7$2e$28$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/next@15.5.2_@babel+core@7.28.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/node_modules/.pnpm/react-redux@9.2.0_@types+react@19.1.15_react@19.1.0_redux@5.0.1/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/store/store.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Providers(param) {
    let { children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_$40$babel$2b$core$40$7$2e$28$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$node_modules$2f2e$pnpm$2f$react$2d$redux$40$9$2e$2$2e$0_$40$types$2b$react$40$19$2e$1$2e$15_react$40$19$2e$1$2e$0_redux$40$5$2e$0$2e$1$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$Workspaces$2f$Thanhs$2d$Workspaces$2f$GraphEditor$2f$src$2f$app$2f$store$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"],
        children: children
    }, void 0, false, {
        fileName: "[project]/Workspaces/Thanhs-Workspaces/GraphEditor/src/app/providers.tsx",
        lineNumber: 6,
        columnNumber: 12
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Workspaces_Thanhs-Workspaces_GraphEditor_src_app_a504df5f._.js.map