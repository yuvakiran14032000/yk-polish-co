"use client";
import { responseJson, type PreparedEnquiry } from "@/lib/api-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { customSchema, type CustomBrief } from "@/lib/validation";
import { customMessage } from "@/lib/enquiry";
import type { Settings } from "@/lib/types";
export function CustomStudio({ settings }: { settings: Settings }) {
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false),
    [prepared, setPrepared] = useState<{
      url: string;
      reference: string | null;
      saved: boolean;
    } | null>(null);
  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CustomBrief>({
    resolver: zodResolver(customSchema),
    defaultValues: {
      occasion: "",
      colors: "",
      shape: "Please help me choose",
      length: "Please help me choose",
      design: "",
      embellishments: [],
      notes: "",
    },
    shouldUnregister: false,
  });
  async function next() {
    const valid = await trigger(
      step === 0
        ? ["occasion", "colors", "shape", "length"]
        : ["design", "embellishments", "notes"],
    );
    if (valid) {
      setError("");
      setStep(step + 1);
    }
  }
  async function submit(brief: CustomBrief) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/custom-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = await responseJson<PreparedEnquiry>(res);
      if (!res.ok) throw new Error(data.error ?? "Please try again.");
      setPrepared(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const fieldError = (name: keyof CustomBrief) =>
    errors[name] && (
      <span className="error" role="alert">
        {errors[name]?.message}
      </span>
    );
  return (
    <form className="studio-form" onSubmit={handleSubmit(submit)}>
      <div className="form-progress" aria-label={`Step ${step + 1} of 3`}>
        {["Your moment", "The little details", "Review & enquire"].map(
          (s, i) => (
            <span key={s} className={step >= i ? "active" : ""}>
              <i>{step > i ? <Check size={11} /> : i + 1}</i>
              {s}
            </span>
          ),
        )}
      </div>
      {prepared ? (
        <div className="form-fields" role="status">
          <h2>
            Your inspiration is <em>ready.</em>
          </h2>
          <p className="small muted">
            {prepared.saved
              ? `Enquiry reference: ${prepared.reference}`
              : "Your brief is prepared and has not been saved to a database."}
          </p>
          <a
            className="button"
            href={prepared.url}
            target="_blank"
            rel="noreferrer"
          >
            Continue in WhatsApp <MessageCircle size={17} />
          </a>
          <p className="fine-print">
            Send your message in WhatsApp to reach us. You can share reference
            images privately in that conversation. An enquiry is not a confirmed
            order.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => setPrepared(null)}
          >
            Return to your brief
          </button>
        </div>
      ) : (
        <>
          <div className="form-fields" key={step}>
            {step === 0 && (
              <>
                <div>
                  <p className="eyebrow">FIRST, THE FEELING</p>
                  <h2>
                    What’s your <em>moment?</em>
                  </h2>
                </div>
                <label>
                  Occasion
                  <select
                    {...register("occasion")}
                    aria-invalid={!!errors.occasion}
                  >
                    <option value="">Choose your moment</option>
                    {[
                      "Everyday",
                      "Office",
                      "College & Events",
                      "Vacation",
                      "Party",
                      "Festive",
                      "Bridal",
                      "Gifting",
                      "Something else",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  {fieldError("occasion")}
                </label>
                <label>
                  Colours you’re dreaming of
                  <input
                    {...register("colors")}
                    maxLength={200}
                    placeholder="Dusty rose, soft ivory, a touch of gold…"
                    aria-invalid={!!errors.colors}
                  />
                  {fieldError("colors")}
                </label>
                <div className="form-row">
                  <label>
                    Shape preference
                    <select {...register("shape")}>
                      {[
                        "Please help me choose",
                        "Almond",
                        "Round",
                        "Oval",
                        "Square",
                        "Coffin",
                        "Stiletto",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Length preference
                    <select {...register("length")}>
                      {["Please help me choose", "Short", "Medium", "Long"].map(
                        (x) => (
                          <option key={x}>{x}</option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
                <p className="fine-print">
                  These are preferences. We’ll confirm which options work for
                  your design.
                </p>
              </>
            )}
            {step === 1 && (
              <>
                <div>
                  <p className="eyebrow">THE LITTLE CANVAS IS YOURS</p>
                  <h2>
                    Tell us the <em>details.</em>
                  </h2>
                </div>
                <label>
                  Your design idea
                  <textarea
                    {...register("design")}
                    rows={5}
                    maxLength={2000}
                    placeholder="An outfit, a pattern, a tiny detail you love…"
                    aria-invalid={!!errors.design}
                  />
                  {fieldError("design")}
                </label>
                <fieldset>
                  <legend className="small">
                    Embellishments you love (optional)
                  </legend>
                  {[
                    "Charms / 3D elements",
                    "Pearls",
                    "Glitter",
                    "Gold details",
                    "Hand-painted art",
                  ].map((e) => (
                    <label className="checkbox-row" key={e}>
                      <input
                        type="checkbox"
                        value={e}
                        {...register("embellishments")}
                      />
                      {e}
                    </label>
                  ))}
                </fieldset>
                <p className="fine-print">
                  Charms / 3D elements +₹50–₹150 · heavy embellishments
                  +₹100–₹250 · highly detailed art +₹100 onwards. We’ll confirm
                  the quote.
                </p>
                <label>
                  Anything else?
                  <textarea
                    rows={2}
                    {...register("notes")}
                    maxLength={1000}
                    placeholder="Sizing help, an event date, a question…"
                  />
                </label>
                <p className="notice">
                  Have inspiration images? Share them directly in WhatsApp after
                  sending your brief.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <p className="eyebrow">A LITTLE LOOK BEFORE WE BEGIN</p>
                  <h2>
                    Entirely <em>you.</em>
                  </h2>
                </div>
                <dl className="review-list">
                  {Object.entries(getValues())
                    .filter(([, v]) => String(v).length > 0)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k === "colors" ? "Colours" : k}</dt>
                        <dd>{Array.isArray(v) ? v.join(", ") : v}</dd>
                      </div>
                    ))}
                </dl>
                <p className="notice">
                  Custom sets start at ₹699+. Your final design, price, sizing,
                  timeline and separate shipping will be confirmed personally.
                </p>
              </>
            )}
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button
                key="next"
                type="button"
                className="button"
                onClick={next}
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                key="submit"
                className="button"
                type="submit"
                disabled={busy}
              >
                {busy ? "Preparing your brief…" : "Prepare your enquiry"}
                <MessageCircle size={16} />
              </button>
            )}
          </div>
          {step === 2 && (
            <>
              <button
                className="text-link"
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      customMessage(getValues()),
                    );
                    setCopied(true);
                  } catch {
                    setError(
                      "Clipboard unavailable. Please use the WhatsApp link.",
                    );
                  }
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
                {copied ? "Brief copied" : "Copy brief for Instagram"}
              </button>
              <p className="fine-print">
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="underlined"
                >
                  Send us an Instagram DM
                </a>{" "}
                and paste your brief.
              </p>
            </>
          )}
        </>
      )}
    </form>
  );
}
