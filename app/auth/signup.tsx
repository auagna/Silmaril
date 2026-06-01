import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signUp } from "@/features/auth/authService";
import { colors, space, radius, font } from "@/constants/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setErr("");
    if (!isSupabaseConfigured()) {
      router.replace("/(tabs)");
      return;
    }
    setLoading(true);
    try {
      const data = await signUp({ email, password, username, name });
      router.replace(data.session ? "/(tabs)" : "/auth/login");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "회원가입 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={8}><Muted>← 뒤로</Muted></Pressable>
      <H1 style={{ marginTop: space.md }}>회원가입</H1>

      <TextInput style={s.input} placeholder="이름" placeholderTextColor={colors.ink400} value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="사용자 이름 (handle)" placeholderTextColor={colors.ink400}
        autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={s.input} placeholder="이메일" placeholderTextColor={colors.ink400}
        autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="비밀번호 (6자 이상)" placeholderTextColor={colors.ink400}
        secureTextEntry value={password} onChangeText={setPassword} />

      {err ? <Text style={s.err}>{err}</Text> : null}

      <Pressable onPress={onSubmit} style={s.btn} disabled={loading}>
        <Text style={s.btnText}>{loading ? "가입 중…" : "회원가입"}</Text>
      </Pressable>

      <View style={{ flexDirection: "row", marginTop: space.lg }}>
        <Muted>이미 계정이 있나요? </Muted>
        <Link href="/auth/login"><Text style={s.link}>로그인</Text></Link>
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
