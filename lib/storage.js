import { supabase } from "@/lib/supabase";

export async function uploadPhotosAndGetUrls(userId, files = []) {
  // Get current session
  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("getSession error:", sessionError);
    throw sessionError;
  }

  const session = sessionData?.session;
  const sessUserId = session?.user?.id ?? null;
  const accessToken = session?.access_token ?? null;

  console.debug("SESSION:", {
    hasSession: !!session,
    hasAccessToken: !!accessToken,
    sessionUserId: sessUserId,
  });

  // Confirm that Supabase can identify the authenticated user
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  console.debug("AUTH CHECK:", {
    authUserId: authUser?.id ?? null,
    expectedUserId: userId,
    authError,
  });

  if (authError) {
    console.error("auth.getUser error:", authError);
    throw authError;
  }

  if (!sessUserId || !authUser?.id) {
    throw new Error("No active auth session (not signed in).");
  }

  if (sessUserId !== authUser.id) {
    throw new Error("Session user mismatch.");
  }

  if (sessUserId !== userId) {
    throw new Error(
      `Auth session user mismatch. Session: ${sessUserId}, requested: ${userId}`
    );
  }

  if (!files || files.length === 0) {
    return [];
  }

  const bucket = "photos";
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file) {
      continue;
    }

    const safeName = (file.name || `photo_${i}`).replace(/\s+/g, "_");

    const path = `offers/${userId}/${Date.now()}_${i}_${safeName}`;

    const options = {
      cacheControl: "3600",
      upsert: false,
      metadata: {
        owner_id: String(userId),
      },
    };

    console.log("Uploading file:", {
      bucket,
      path,
      name: file.name,
      type: file.type,
      size: file.size,
      userId,
      authUserId: authUser.id,
    });

    // Upload
    const {
      data: uploadData,
      error: uploadError,
    } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);

    console.log("UPLOAD RESULT:", {
      uploadData,
      uploadError,
    });

    if (uploadError) {
      console.error("storage.upload error:", {
        message: uploadError.message,
        name: uploadError.name,
        statusCode: uploadError.statusCode,
        error: uploadError,
      });

      throw uploadError;
    }

    console.debug("upload success:", {
      path,
      uploadData,
    });

    // Get public URL
    const {
      data: publicData,
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    const publicUrl = publicData?.publicUrl;

    console.debug("publicUrl:", {
      path,
      publicUrl,
    });

    let finalUrl = null;

    // Check public URL
    if (publicUrl) {
      try {
        const head = await fetch(publicUrl, {
          method: "HEAD",
        });

        if (head.ok) {
          finalUrl = publicUrl;
        }
      } catch (e) {
        console.debug("Public URL HEAD check failed:", e?.message || e);
      }
    }

    // Fallback to signed URL
    if (!finalUrl) {
      const {
        data: signedData,
        error: signedError,
      } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);

      if (signedError) {
        console.error("createSignedUrl error:", signedError);
        throw signedError;
      }

      finalUrl = signedData?.signedUrl ?? null;
    }

    if (!finalUrl) {
      throw new Error(`Could not create URL for uploaded file: ${path}`);
    }

    urls.push(finalUrl);
  }

  return urls;
}