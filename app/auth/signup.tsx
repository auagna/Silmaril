import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { H1, Muted } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signUp } from "@/features/auth/authService";
import { useTheme, space, radius, font, type Palette } from "@/theme";

export default function SignupScreen() {
  const router = useRouter();
  const c = useTheme().colors;
  const s = useMemo(() => makeStyles(c), [c]);
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
      <Pressable onPress={() => router.back()} hitSlop={10}><Muted>← 뒤로</Muted></Pressable>
      <H1 style={{ marginTop: space.md }}>회원가입</H1>

      <TextInput style={s.input} placeholder="이름" placeholderTextColor={c.textMuted} value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="사용자 이름 (handle)" placeholderTextColor={c.textMuted}
        autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={s.input} placeholder="이메일" placeholderTextColor={c.textMuted}
        autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="비밀번호 (6자 이상)" placeholderTextColor={c.textMuted}
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

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    input: { marginTop: space.md, borderWidth: 1, borderColor: c.lineDefault, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, fontSize: font.body, color: c.textMain, backgroundColor: c.surface },
    err: { color: c.accentActive, fontSize: font.small, marginTop: space.sm },
    btn: { marginTop: space.lg, backgroundColor: c.nodeDefault, borderRadius: radius.pill, paddingVertical: 14, alignItems: "center" },
    btnText: { color: c.nodeText, fontWeight: "700", fontSize: font.body },
    link: { color: c.accentActive, fontWeight: "600", fontSize: font.small },
  });
