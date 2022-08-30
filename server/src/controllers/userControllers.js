exports.testing = (req, res) => {
   try {
      res.status(200).json({
         message: "OK"
      })
   } catch (err) {
      res.status(501).json({ err: err.message })
   }
}