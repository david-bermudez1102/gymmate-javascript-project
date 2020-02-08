class AddAttachmentProfilePictureToAccounts < ActiveRecord::Migration[5.2]
  def self.up
    change_table :accounts do |t|
      t.attachment :profile_picture
    end
  end

  def self.down
    remove_attachment :accounts, :profile_picture
  end
end
