import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signIn } from "@/features/auth/authService";
import { colors, space, radius, font } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setErr("");
    if (!isSupabaseConfigured()) {
      router.replace("/(tabs)"); // 더미 모드: 그냥 진입
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      router.replace("/(tabs)");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={8}><Muted>← 뒤로</Muted></Pressable>
      <H1 style={{ marginTop: space.md }}>로그인</H1>

      <TextInput style={s.input} placeholder="이메일" placeholderTextColor={colors.ink400}
        autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="비밀번호" placeholderTextColor={colors.ink400}
        secureTextEntry value={password} onChangeText={setPassword} />

      {err ? <Text style={s.err}>{err}</Text> : null}

      <Pressable onPress={onSubmit} style={s.btn} disabled={loading}>
        <Text style={s.btnText}>{loading ? "로그인 중…" : "로그인"}</Text>
      </Pressable>

      <View style={{ flexDirection: "row", marginTop: space.lg }}>
        <Muted>계정이 없나요? </Muted>
        <Link href="/auth/signup"><Text style={s.link}>회원가입</Text></Link>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  input: {
    marginTop: space.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md,
    paddingHorizontal: space.md, paddingVertical: 12, fontSize: font.body, color: colors.ink900, backgroundColor: colors.surface,
  },
  err: { color: colors.danger, fontSize: font.small, marginTop: space.sm },
  btn: { marginTop: space.lg, backgroundColor: colors.ink900, borderRadius: radius.pill, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: font.body },
  link: { color: colors.accent, fontWeight: "600", fontSize: font.small },
});
