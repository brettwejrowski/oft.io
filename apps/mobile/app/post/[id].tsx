import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePost, useComments, useCreateComment, useVote } from "@placewise/shared";
import type { Comment } from "@placewise/shared";

function CommentItem({ item }: { item: Comment }) {
  return (
    <View style={styles.comment}>
      <Text style={styles.commentBody}>{item.body}</Text>
      <Text style={styles.muted}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );
}

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const { data: post, isLoading } = usePost(postId);
  const { data: comments = [] } = useComments(postId);
  const vote = useVote(postId);
  const createComment = useCreateComment(postId);
  const [commentBody, setCommentBody] = useState("");

  if (isLoading || !post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>{isLoading ? "Loading…" : "Post not found"}</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (!commentBody.trim()) return;
    createComment.mutate({ body: commentBody }, { onSuccess: () => setCommentBody("") });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <View>
            {/* Post Card */}
            <View style={styles.postCard}>
              <View style={styles.voteCol}>
                <TouchableOpacity onPress={() => vote.mutate(1)}>
                  <Text style={styles.voteBtn}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.score}>{post.score}</Text>
                <TouchableOpacity onPress={() => vote.mutate(-1)}>
                  <Text style={[styles.voteBtn, { color: "#ef4444" }]}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.postTitle}>{post.title}</Text>
                {post.body && <Text style={styles.postBody}>{post.body}</Text>}
                <Text style={styles.meta}>📍 {post.location_name}</Text>
                <Text style={[styles.meta, { color: "#4f46e5" }]} numberOfLines={1}>
                  {post.external_url}
                </Text>
              </View>
            </View>

            {/* Comment input */}
            <View style={styles.commentInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Add a comment…"
                value={commentBody}
                onChangeText={setCommentBody}
                multiline
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Post</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
          </View>
        )}
        renderItem={({ item }) => <CommentItem item={item} />}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  voteCol: { alignItems: "center", gap: 4 },
  voteBtn: { fontSize: 20, color: "#9ca3af" },
  score: { fontWeight: "700", fontSize: 15, color: "#111" },
  postTitle: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 6 },
  postBody: { fontSize: 13, color: "#374151", marginBottom: 8 },
  meta: { fontSize: 12, color: "#6b7280", marginTop: 3 },
  commentInput: { marginBottom: 16 },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    minHeight: 72,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  sectionTitle: { fontWeight: "600", color: "#374151", marginBottom: 8 },
  comment: {
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 12,
    marginBottom: 12,
  },
  commentBody: { fontSize: 13, color: "#374151" },
  muted: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
});
