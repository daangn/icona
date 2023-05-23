"use strict";
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
const core_1 = require("@octokit/core");
const octokitClient = (githubToken) => {
    const octokit = new core_1.Octokit({
        auth: githubToken,
    });
    return octokit;
};
const pushToGithub = ({ contents, githubToken, message, owner, 
// path,
repo, targetBranch, }) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = octokitClient(githubToken);
    const { data: baseBranch } = yield octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
        owner,
        repo,
        branch: "main",
    });
    const { data: baseTree } = yield octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
        owner,
        repo,
        tree_sha: baseBranch.commit.sha,
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
            path: blob.name,
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
        parents: [baseBranch.commit.sha],
    });
    const newBranch = yield octokit.request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        repo,
        ref: `refs/heads/${targetBranch}`,
        sha: commit.data.sha,
    });
    yield octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
        owner,
        repo,
        ref: newBranch.data.ref,
        sha: commit.data.sha,
    });
});
exports.pushToGithub = pushToGithub;
