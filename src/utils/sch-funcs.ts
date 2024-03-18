export async function mMake() {
    const response = await fetch("http://localhost:5757/admin/football/queue/sendx", {
        body: JSON.stringify({
            count: 250
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJhb3F2Njd2eWFjbTF0am51enU0ZjlkaSIsImVtYWlsIjoiYWRtaW5AbS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDk4NjI2Mzd9.y5HP09h66b-5rXPznBsW89uGg56_v_m4FRPnMRfe_Ok"
        }
    });

    const result = await response.json();

    console.log(result);
}

export async function mSim() {
    const response = await fetch("http://localhost:5757/admin/football/queue/send-to-sim", {
        method: "POST",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJhb3F2Njd2eWFjbTF0am51enU0ZjlkaSIsImVtYWlsIjoiYWRtaW5AbS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDk4NjI2Mzd9.y5HP09h66b-5rXPznBsW89uGg56_v_m4FRPnMRfe_Ok"
        }
    });

    const result = await response.json();

    console.log(result);
}