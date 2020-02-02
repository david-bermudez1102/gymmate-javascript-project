class AddAttachmentAttachmentToMedia < ActiveRecord::Migration[5.2]
  def self.up
    change_table :media do |t|
      t.attachment :attachment
    end
  end

  def self.down
    remove_attachment :media, :attachment
  end
end
