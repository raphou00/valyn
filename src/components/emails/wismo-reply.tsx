import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type Props = {
    preview: string;
    greeting: string;
    body: string;
    signature: string;
};

const WismoReply: React.FC<Props> = ({
    preview,
    greeting,
    body,
    signature,
}) => {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Body
                style={{
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    color: "#202124",
                }}
            >
                <Container style={{ maxWidth: 560, padding: "24px 16px" }}>
                    <Section>
                        <Text>{greeting}</Text>
                        {body.split("\n").map((line, i) => (
                            <Text key={i} style={{ margin: "0 0 8px" }}>
                                {line}
                            </Text>
                        ))}
                        <Text style={{ marginTop: 24, whiteSpace: "pre-line" }}>
                            {signature}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default WismoReply;
