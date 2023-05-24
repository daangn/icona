"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushToGithub = void 0;
const core = __importStar(require("@actions/core"));
const core_1 = require("@octokit/core");
const octokitClient = (githubToken) => {
    const octokit = new core_1.Octokit({
        auth: githubToken,
    });
    return octokit;
};
const pushToGithub = ({ contents, githubToken, message, owner, path, repo, targetBranch, }) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = octokitClient(githubToken);
    const { data: targetBranchTree } = yield octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
        owner,
        repo,
        branch: targetBranch,
    });
    const { data: baseTree } = yield octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
        owner,
        repo,
        tree_sha: targetBranchTree.commit.sha,
    });
    const blobs = yield Promise.all(contents.map((content) => octokit
        .request("POST /repos/{owner}/{repo}/git/blobs", {
        owner,
        repo,
        content: content.svg,
        encoding: "utf-8",
    })
        .then((blob) => ({
        name: content.name,
        data: blob.data,
    }))));
    const treeBlobs = blobs.map((blob) => {
        return {
            path: path ? `${path}/${blob.name}.svg` : `${blob.name}.svg`,
            mode: "100644",
            type: "blob",
            sha: blob.data.sha,
        };
    });
    const tree = yield octokit.request("POST /repos/{owner}/{repo}/git/trees", {
        owner,
        repo,
        base_tree: baseTree.sha,
        tree: treeBlobs,
    });
    const commit = yield octokit.request("POST /repos/{owner}/{repo}/git/commits", {
        owner,
        repo,
        message,
        tree: tree.data.sha,
        parents: [targetBranchTree.commit.sha],
    });
    const currentRef = yield octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
        owner,
        repo,
        ref: `heads/${targetBranch}`,
    });
    core.info(`currentRef.data.ref: ${currentRef.data.ref}`);
    yield octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
        owner,
        repo,
        ref: `heads/${targetBranch}`,
        sha: commit.data.sha,
        force: true,
    });
});
exports.pushToGithub = pushToGithub;
